import Jobs from "../model/Jobs.js";
import SkillSet from "../model/SkillSet.js";
import JobSkill from "../model/JobSkill.js";

import { getJobTitleForJobs } from "./jobTitleServices.js";
import { fetchCebuJobs } from "./ai.services.js";


export async function saveJob(jobData) {

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


    for (const skill of normalizedSkills) {

      const skillSet = await SkillSet.findOne({
        where: {
          skill_set_name: skill,
        },
      });


      if (!skillSet) {

        console.log(
          `Skill not found in SkillSet: ${skill}`
        );

        continue;
      }


      await JobSkill.create({
        job_id: job.job_id,
        skill_set_id: skillSet.skill_set_id,
      });

    }

  }


  return {
    job,
    created,
  };
}


export async function importJobs(jobs) {

  if (!Array.isArray(jobs)) {
    throw new Error("Jobs must be an array");
  }

  return Promise.all(
    jobs.map((jobData) =>
      saveJob(jobData)
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


export async function importJobsByJobTitle(
  job_title_id
) {

  const jobTitle =
    await getJobTitleForJobs(job_title_id);

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


  return {
    job_title_id:
      jobTitle.job_title_id,

    job_title_name:
      jobTitle.job_title_name,

    count:
      results.length,

    results,
  };

}