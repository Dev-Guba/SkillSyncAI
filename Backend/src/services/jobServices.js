import Jobs from "../model/Jobs.js";
import SkillSet from "../model/SkillSet.js";
import JobSkill from "../model/JobSkill.js";

import { getJobTitleForJobs } from "./jobTitleServices.js";
import { fetchCebuJobs, extractJobSkills } from "./ai.services.js";
import { getSkillAliases, scanEmergingSkills } from "./skillDiscoveryServices.js";


// Loads every skill once as { lowercased name -> skill_set_id }, so saving a
// batch of jobs doesn't run one database query per skill per job.
async function loadSkillIdMap() {
  const skillSets = await SkillSet.findAll({
    attributes: ["skill_set_id", "skill_set_name"],
  });

  const map = new Map(
    skillSets.map((s) => [
      String(s.skill_set_name).trim().toLowerCase(),
      s.skill_set_id,
    ])
  );

  // Merged spellings ("reactjs") count for their catalog skill (React)
  for (const { term, skill_set_id } of await getSkillAliases()) {
    if (!map.has(term)) map.set(term, skill_set_id);
  }

  return map;
}

export async function saveJob(jobData, skillIdMap = null) {

  const {
    job_title_id,
    external_job_id,
    title,
    company,
    location,
    classification,
    subclassification,
    description,
    salary,
    employment_type,
    source,
    posted_date,
    url,
    skills = [],
  } = jobData;


  if (!external_job_id) {
    throw new Error("external_job_id is required");
  }

  if (!title) {
    throw new Error("title is required");
  }

  if (!source) {
    throw new Error("source is required");
  }


  const fields = {
    job_title_id,
    title,
    company,
    location,
    classification,
    subclassification,
    description,
    salary,
    employment_type,
    source,
    posted_date,
    url,
  };


  /*
  |--------------------------------------------------------------------------
  | Save Job
  |--------------------------------------------------------------------------
  */

  const [job, created] = await Jobs.findOrCreate({
    where: {
      external_job_id,
    },
    defaults: fields,
  });


  if (!created) {
    await job.update(fields);
  }


  /*
  |--------------------------------------------------------------------------
  | Save Job Skills
  |--------------------------------------------------------------------------
  */

  if (Array.isArray(skills)) {

    // Remove previous skill relationships
    await JobSkill.destroy({
      where: {
        job_id: job.job_id,
      },
    });


    // Normalize extracted skills
    const normalizedSkills = [
      ...new Set(
        skills
          .map((skill) =>
            String(skill).trim().toLowerCase()
          )
          .filter(Boolean)
      ),
    ];


    const skillIds = skillIdMap || (await loadSkillIdMap());

    const rows = [];

    for (const skill of normalizedSkills) {
      const skill_set_id = skillIds.get(skill);

      if (!skill_set_id) {
        console.log(
          `Skill not found in SkillSet: ${skill}`
        );
        continue;
      }

      rows.push({
        job_id: job.job_id,
        skill_set_id,
      });
    }

    if (rows.length) {
      await JobSkill.bulkCreate(rows);
    }

  }


  return {
    job,
    created,
  };
}


/*
| Re-runs skill extraction on every saved posting and replaces its skill
| links. Used after the extractor or the catalog changes (new approved
| skills, merged spellings), so past postings — and the forecasts built from
| them — reflect the current rules. Postings are sent to the AI service in
| batches.
*/
export async function reanalyzeSavedJobSkills() {
  const jobs = await Jobs.findAll({
    attributes: ["job_id", "title", "description"],
    order: [["job_id", "ASC"]],
  });

  const skillIdMap = await loadSkillIdMap();
  let linked = 0;
  let withSkills = 0;
  const BATCH = 100;

  for (let i = 0; i < jobs.length; i += BATCH) {
    const batch = jobs.slice(i, i + BATCH);
    const processed = await extractJobSkills(
      batch.map((j) => ({ id: j.job_id, title: j.title, description: j.description }))
    );

    const rows = [];
    for (const job of processed.jobs || []) {
      const ids = [
        ...new Set(
          (job.skills || [])
            .map((s) => skillIdMap.get(String(s).trim().toLowerCase()))
            .filter(Boolean)
        ),
      ];
      if (ids.length) withSkills += 1;
      for (const skill_set_id of ids) rows.push({ job_id: job.id, skill_set_id });
    }

    const batchIds = batch.map((j) => j.job_id);
    await JobSkill.sequelize.transaction(async (transaction) => {
      await JobSkill.destroy({ where: { job_id: batchIds }, transaction });
      if (rows.length) await JobSkill.bulkCreate(rows, { transaction });
    });
    linked += rows.length;
  }

  return { jobs: jobs.length, jobs_with_skills: withSkills, skill_links: linked };
}

export async function importJobs(jobs) {

  if (!Array.isArray(jobs)) {
    throw new Error("Jobs must be an array");
  }

  const skillIdMap = await loadSkillIdMap();

  return Promise.all(
    jobs.map((jobData) =>
      saveJob(jobData, skillIdMap)
    )
  );

}


export async function importCebuJobs() {

  const jobs = await fetchCebuJobs();

  const results = await importJobs(jobs);

  return {
    count: results.length,
    results,
  };

}


export async function fetchJobsByJobTitle(job_title_id) {

  const jobTitle =
    await getJobTitleForJobs(job_title_id);

  const jobs = await Jobs.findAll({
    where: {
      job_title_id: jobTitle.job_title_id,
    },
    order: [
      ["posted_date", "DESC"],
    ],
  });

  return {
    job_title_id: jobTitle.job_title_id,
    job_title_name: jobTitle.job_title_name,
    count: jobs.length,
    jobs,
  };
}


/*
| Scheduled collection (Objective 2.1): imports jobs for the careers mapped
| to ANY program, not only careers students picked, so every program gets
| labor market data and monthly history builds up for the forecasts.
| Each run handles the careers that were imported longest ago (never-imported
| first), at most SCHEDULED_IMPORT_MAX_TITLES per run (default 10) to control
| scraping credits; careers imported in the last 12 hours are skipped.
*/
let scheduledRunInFlight = null;

export function runScheduledImport() {
  if (!scheduledRunInFlight) {
    scheduledRunInFlight = doScheduledImport().finally(() => {
      scheduledRunInFlight = null;
    });
  }
  return scheduledRunInFlight;
}

async function doScheduledImport() {
  const maxTitles = Math.max(1, Number(process.env.SCHEDULED_IMPORT_MAX_TITLES) || 10);
  const started = Date.now();

  // Careers mapped to programs, least recently imported first
  const careers = await Jobs.sequelize.query(
    `SELECT pj.job_title_id, MAX(j.updatedAt) AS last_import
     FROM (SELECT DISTINCT job_title_id FROM ProgramJobTitles) pj
     LEFT JOIN Jobs j ON j.job_title_id = pj.job_title_id
     GROUP BY pj.job_title_id
     ORDER BY (MAX(j.updatedAt) IS NOT NULL), MAX(j.updatedAt) ASC
     LIMIT ?`,
    { replacements: [maxTitles], type: Jobs.sequelize.QueryTypes.SELECT }
  );

  const summary = { careers_checked: 0, imported: 0, jobs_saved: 0, skipped_recent: 0, failed: 0 };

  for (const { job_title_id } of careers) {
    summary.careers_checked += 1;
    try {
      const result = await importJobsByJobTitle(job_title_id);
      if (result.cached) {
        summary.skipped_recent += 1;
      } else {
        summary.imported += 1;
        summary.jobs_saved += result.count || 0;
      }
    } catch (error) {
      summary.failed += 1;
      console.error(`Scheduled import failed for career ${job_title_id}:`, error.message);
    }
  }

  summary.seconds = Math.round((Date.now() - started) / 1000);
  console.log("Scheduled import:", JSON.stringify(summary));
  return summary;
}

/*
| Scraping JobStreet takes about a minute, so a job title's listings are only
| re-imported when the newest saved ones are older than this. Pass
| { force: true } to import anyway.
*/
const JOB_IMPORT_FRESH_MS = 12 * 60 * 60 * 1000;
const importsInFlight = new Map(); // job_title_id -> Promise

export async function importJobsByJobTitle(
  job_title_id,
  { force = false } = {}
) {

  const jobTitle =
    await getJobTitleForJobs(job_title_id);

  if (!force) {
    const lastUpdated = await Jobs.max("updatedAt", {
      where: { job_title_id: jobTitle.job_title_id },
    });

    if (
      lastUpdated &&
      Date.now() - new Date(lastUpdated).getTime() < JOB_IMPORT_FRESH_MS
    ) {
      const count = await Jobs.count({
        where: { job_title_id: jobTitle.job_title_id },
      });

      return {
        job_title_id: jobTitle.job_title_id,
        job_title_name: jobTitle.job_title_name,
        count,
        cached: true,
        last_imported: lastUpdated,
      };
    }
  }

  // If this title is already being imported (e.g. two pages opened at once),
  // wait for that import instead of scraping twice.
  const key = String(jobTitle.job_title_id);
  if (importsInFlight.has(key)) {
    return importsInFlight.get(key);
  }

  const run = runJobImport(jobTitle).finally(() => {
    importsInFlight.delete(key);
  });
  importsInFlight.set(key, run);
  return run;
}

async function runJobImport(jobTitle) {

  const jobs =
    await fetchCebuJobs(
      jobTitle.job_title_name
    );


  const jobsWithJobTitle =
    jobs.map((job) => ({
      ...job,
      job_title_id:
        jobTitle.job_title_id,
    }));


  const results =
    await importJobs(jobsWithJobTitle);

  // Look for new skills in the fresh postings, in the background so the
  // import (and the page waiting on it) isn't slowed down.
  scanEmergingSkills().catch((error) => {
    console.error("Emerging skill scan failed:", error.response?.data || error.message);
  });


  return {
    job_title_id:
      jobTitle.job_title_id,

    job_title_name:
      jobTitle.job_title_name,

    count:
      results.length,

    cached: false,

    results,
  };

}