import axios from "axios";
import { Op } from "sequelize";

import sequelize from "../config/db.js";
import Jobs from "../model/Jobs.js";
import SkillSet from "../model/SkillSet.js";
import JobSkill from "../model/JobSkill.js";
import { SkillCandidate, SkillCandidateJob } from "../model/SkillCandidate.js";

/*
| Emerging-skill discovery (Objectives 2.1 and 2.3).
|
| The AI service's skill extraction only recognizes skills already in the
| catalog, so a new skill in job postings would never be counted or
| forecast. After each job import (and when an admin clicks "Scan"), saved
| job descriptions are sent to the AI service's /discover-skills, which
| returns skill-like terms that aren't in the catalog and are mentioned by
| at least 2 postings from 2 different companies. They're stored here as
| *pending* until an admin:
|   - approves: added to the catalog and linked to the postings that
|     mention it, so it shows up in skill gaps and forecasts right away;
|   - merges into an existing skill ("ReactJS" -> React): those postings
|     count for that skill, and future postings saying "ReactJS" do too;
|   - rejects: ignored from then on.
*/

const AI_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
const MAX_JOBS_PER_SCAN = 2000;

function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();

// Merged candidates act as alternative spellings of catalog skills:
// [{ term: "reactjs", skill_set_id: 12 }]
export async function getSkillAliases() {
    const rows = await SkillCandidate.findAll({
        where: { status: "merged", skill_set_id: { [Op.ne]: null } },
        attributes: ["term", "skill_set_id"],
    });
    return rows.map((r) => ({ term: r.term, skill_set_id: r.skill_set_id }));
}

// ---- Scan ---------------------------------------------------------------

let scanInFlight = null;

export function scanEmergingSkills() {
    // One scan at a time; callers during a scan share its result
    if (!scanInFlight) {
        scanInFlight = runScan().finally(() => {
            scanInFlight = null;
        });
    }
    return scanInFlight;
}

async function runScan() {
    const jobs = await Jobs.findAll({
        attributes: ["job_id", "company", "description"],
        where: { description: { [Op.ne]: null } },
        order: [["updatedAt", "DESC"]],
        limit: MAX_JOBS_PER_SCAN,
    });

    const skills = await SkillSet.findAll({ attributes: ["skill_set_id", "skill_set_name"] });
    const aliases = await getSkillAliases();
    const idByName = new Map(skills.map((s) => [norm(s.skill_set_name), s.skill_set_id]));

    // Catalog names + merged spellings count as already known
    const dictionary = [
        ...skills.map((s) => s.skill_set_name),
        ...aliases.map((a) => a.term),
    ];

    const response = await axios.post(
        `${AI_URL}/discover-skills`,
        {
            jobs: jobs.map((j) => ({ id: j.job_id, company: j.company, description: j.description })),
            skill_dictionary: dictionary,
        },
        { timeout: 120 * 1000, maxBodyLength: Infinity, maxContentLength: Infinity }
    );

    const candidates = response.data?.candidates || [];
    const now = new Date();
    let created = 0;

    for (const c of candidates) {
        const term = norm(c.term).slice(0, 100);
        if (!term) continue;

        const similarId = c.similar_to ? idByName.get(norm(c.similar_to)) || null : null;

        let row = await SkillCandidate.findOne({ where: { term } });
        if (!row) {
            row = await SkillCandidate.create({
                term,
                display_name: String(c.display_name || term).slice(0, 100),
                company_count: c.company_count || 0,
                similar_skill_set_id: similarId,
                status: "pending",
                first_seen_at: now,
                last_seen_at: now,
            });
            created += 1;
        } else {
            const patch = {
                last_seen_at: now,
                company_count: Math.max(row.company_count || 0, c.company_count || 0),
            };
            if (row.status === "pending") {
                patch.display_name = String(c.display_name || row.display_name).slice(0, 100);
                patch.similar_skill_set_id = similarId;
            }
            await row.update(patch);
        }

        const jobIds = (c.job_ids || []).filter((id) => Number.isInteger(id));
        if (jobIds.length) {
            await SkillCandidateJob.bulkCreate(
                jobIds.map((job_id) => ({ candidate_id: row.id, job_id })),
                { ignoreDuplicates: true }
            );
        }

        // Distinct postings ever seen, across all scans
        const jobCount = await SkillCandidateJob.count({ where: { candidate_id: row.id } });
        await row.update({ job_count: jobCount });
    }

    return {
        scanned_jobs: jobs.length,
        candidates_found: candidates.length,
        new_candidates: created,
    };
}

// ---- Review -------------------------------------------------------------

export async function listCandidates(status = "pending") {
    const where = status === "all" ? {} : { status };
    const rows = await SkillCandidate.findAll({
        where,
        order: [["job_count", "DESC"], ["company_count", "DESC"], ["display_name", "ASC"]],
        limit: 200,
    });

    const skillIds = [
        ...new Set(rows.flatMap((r) => [r.similar_skill_set_id, r.skill_set_id]).filter(Boolean)),
    ];
    const skills = skillIds.length
        ? await SkillSet.findAll({ where: { skill_set_id: skillIds } })
        : [];
    const nameById = new Map(skills.map((s) => [s.skill_set_id, s.skill_set_name]));

    return rows.map((r) => ({
        id: r.id,
        term: r.term,
        display_name: r.display_name,
        job_count: r.job_count,
        company_count: r.company_count,
        status: r.status,
        similar_skill: r.similar_skill_set_id
            ? { skill_set_id: r.similar_skill_set_id, skill_set_name: nameById.get(r.similar_skill_set_id) || null }
            : null,
        skill: r.skill_set_id
            ? { skill_set_id: r.skill_set_id, skill_set_name: nameById.get(r.skill_set_id) || null }
            : null,
        reviewed_by: r.reviewed_by,
        reviewed_at: r.reviewed_at,
        first_seen_at: r.first_seen_at,
        last_seen_at: r.last_seen_at,
    }));
}

async function findOpenCandidate(id, transaction) {
    const row = await SkillCandidate.findByPk(Number(id), { transaction, lock: transaction.LOCK.UPDATE });
    if (!row) throw httpError(404, "That suggestion no longer exists.");
    if (row.status === "approved" || row.status === "merged") {
        throw httpError(409, "This suggestion was already handled.");
    }
    return row;
}

// Link a catalog skill to every posting that mentioned the candidate
async function linkJobs(candidateId, skillSetId, transaction) {
    const links = await SkillCandidateJob.findAll({ where: { candidate_id: candidateId }, transaction });
    const jobIds = links.map((l) => l.job_id);
    if (!jobIds.length) return 0;

    // Only postings that still exist and aren't linked yet
    const existingJobs = await Jobs.findAll({ where: { job_id: jobIds }, attributes: ["job_id"], transaction });
    const already = await JobSkill.findAll({
        where: { job_id: jobIds, skill_set_id: skillSetId },
        attributes: ["job_id"],
        transaction,
    });
    const alreadySet = new Set(already.map((a) => a.job_id));
    const rows = existingJobs
        .map((j) => j.job_id)
        .filter((jobId) => !alreadySet.has(jobId))
        .map((job_id) => ({ job_id, skill_set_id: skillSetId }));

    if (rows.length) await JobSkill.bulkCreate(rows, { transaction });
    return rows.length;
}

export async function approveCandidate(admin, id, name) {
    return sequelize.transaction(async (transaction) => {
        const row = await findOpenCandidate(id, transaction);
        const skillName = String(name || row.display_name).trim();

        if (!skillName) throw httpError(400, "Please enter a skill name.");
        if (skillName.length > 100) throw httpError(400, "Skill name is too long.");

        const exists = await SkillSet.findOne({
            where: sequelize.where(sequelize.fn("LOWER", sequelize.col("skill_set_name")), norm(skillName)),
            transaction,
        });
        if (exists) {
            throw httpError(409, `"${exists.skill_set_name}" is already in the catalog. Use Merge instead.`);
        }

        const skill = await SkillSet.create({ skill_set_name: skillName }, { transaction });
        const linked = await linkJobs(row.id, skill.skill_set_id, transaction);

        await row.update({
            status: "approved",
            skill_set_id: skill.skill_set_id,
            reviewed_by: admin.username,
            reviewed_at: new Date(),
        }, { transaction });

        return { skill_set_id: skill.skill_set_id, skill_set_name: skill.skill_set_name, linked_jobs: linked };
    });
}

export async function mergeCandidate(admin, id, skillSetId) {
    return sequelize.transaction(async (transaction) => {
        const row = await findOpenCandidate(id, transaction);
        const skill = await SkillSet.findByPk(Number(skillSetId), { transaction });
        if (!skill) throw httpError(404, "Choose an existing skill to merge into.");

        const linked = await linkJobs(row.id, skill.skill_set_id, transaction);

        await row.update({
            status: "merged",
            skill_set_id: skill.skill_set_id,
            reviewed_by: admin.username,
            reviewed_at: new Date(),
        }, { transaction });

        return { skill_set_id: skill.skill_set_id, skill_set_name: skill.skill_set_name, linked_jobs: linked };
    });
}

export async function rejectCandidate(admin, id) {
    return sequelize.transaction(async (transaction) => {
        const row = await findOpenCandidate(id, transaction);
        await row.update({
            status: "rejected",
            reviewed_by: admin.username,
            reviewed_at: new Date(),
        }, { transaction });
        return { id: row.id, status: "rejected" };
    });
}

// Put a rejected suggestion back in the pending list
export async function reopenCandidate(id) {
    const row = await SkillCandidate.findByPk(Number(id));
    if (!row) throw httpError(404, "That suggestion no longer exists.");
    if (row.status !== "rejected") throw httpError(409, "Only rejected suggestions can be reopened.");
    await row.update({ status: "pending", reviewed_by: null, reviewed_at: null });
    return { id: row.id, status: "pending" };
}
