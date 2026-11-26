import sequelize from "../config/db.js";
import { curriculumSimilarity } from "./ai.services.js";

/*
| Curriculum alignment (Objective 2.4).
|
| For a program, compares the skills it teaches (Program_Skills) with the
| skills Cebu employers ask for in postings for the program's careers
| (ProgramJobTitles -> Jobs -> JobSkills):
|   - covered:  in demand AND taught
|   - gaps:     in demand but NOT taught  (curriculum misalignment)
|   - unused:   taught but not seen in any posting yet
|   - emerging: pending skill suggestions (not in the catalog yet) found in
|               those postings
| Coverage is demand-weighted: share of all skill mentions in the program's
| postings that the program teaches.
|
| Results depend on how many postings have skills linked; `data` reports
| that so pages can warn when the sample is too small to rely on.
*/

// How many postings (with at least one linked skill) the result rests on
function confidenceFor(postingsWithSkills) {
    if (postingsWithSkills >= 50) return "good";
    if (postingsWithSkills >= 20) return "moderate";
    if (postingsWithSkills > 0) return "low";
    return "none";
}

const q = (sql, replacements) =>
    sequelize.query(sql, { replacements, type: sequelize.QueryTypes.SELECT });

function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

export async function getProgramAlignment(programId) {
    const id = Number(programId);
    if (!Number.isInteger(id)) throw httpError(400, "Invalid program.");

    const [program] = await q(
        "SELECT program_id, program_code, program_name FROM Programs WHERE program_id = ?",
        [id]
    );
    if (!program) throw httpError(404, "Program not found.");

    const careers = await q(
        `SELECT jt.job_title_id, jt.job_title_name
         FROM ProgramJobTitles pj JOIN Job_title jt ON jt.job_title_id = pj.job_title_id
         WHERE pj.program_id = ? ORDER BY jt.job_title_name`,
        [id]
    );

    const [counts] = await q(
        `SELECT COUNT(DISTINCT j.job_id) AS postings,
                COUNT(DISTINCT js.job_id) AS postings_with_skills
         FROM Jobs j
         JOIN ProgramJobTitles pj ON pj.job_title_id = j.job_title_id AND pj.program_id = ?
         LEFT JOIN JobSkills js ON js.job_id = j.job_id`,
        [id]
    );

    // Demand: in how many of the program's postings each skill appears
    const demand = await q(
        `SELECT s.skill_set_id, s.skill_set_name, COUNT(DISTINCT js.job_id) AS postings,
                EXISTS (SELECT 1 FROM Program_Skills ps
                        WHERE ps.program_id = ? AND ps.skill_set_id = s.skill_set_id) AS taught
         FROM JobSkills js
         JOIN Jobs j ON j.job_id = js.job_id
         JOIN ProgramJobTitles pj ON pj.job_title_id = j.job_title_id AND pj.program_id = ?
         JOIN Skill_set s ON s.skill_set_id = js.skill_set_id
         GROUP BY s.skill_set_id, s.skill_set_name
         ORDER BY postings DESC, s.skill_set_name ASC`,
        [id, id]
    );

    const taughtRows = await q(
        `SELECT s.skill_set_id, s.skill_set_name
         FROM Program_Skills ps JOIN Skill_set s ON s.skill_set_id = ps.skill_set_id
         WHERE ps.program_id = ? ORDER BY s.skill_set_name`,
        [id]
    );

    const emerging = await q(
        `SELECT c.id, c.display_name, COUNT(DISTINCT scj.job_id) AS postings
         FROM Skill_Candidate_Jobs scj
         JOIN Skill_Candidates c ON c.id = scj.candidate_id AND c.status = 'pending'
         JOIN Jobs j ON j.job_id = scj.job_id
         JOIN ProgramJobTitles pj ON pj.job_title_id = j.job_title_id AND pj.program_id = ?
         GROUP BY c.id, c.display_name
         ORDER BY postings DESC LIMIT 10`,
        [id]
    );

    const postingsWithSkills = Number(counts?.postings_with_skills || 0);
    const items = demand.map((d) => ({
        skill_set_id: d.skill_set_id,
        skill_set_name: d.skill_set_name,
        postings: Number(d.postings),
        share: postingsWithSkills ? Math.round((Number(d.postings) / postingsWithSkills) * 100) : 0,
        taught: Boolean(Number(d.taught)),
    }));

    const covered = items.filter((i) => i.taught);
    const gaps = items.filter((i) => !i.taught);
    const demandedIds = new Set(items.map((i) => i.skill_set_id));
    const unused = taughtRows.filter((t) => !demandedIds.has(t.skill_set_id));

    const totalMentions = items.reduce((sum, i) => sum + i.postings, 0);
    const coveredMentions = covered.reduce((sum, i) => sum + i.postings, 0);

    // TF-IDF + cosine similarity of the curriculum vs the market (AI service)
    const cosine = items.length
        ? await curriculumSimilarity(
              taughtRows.map((t) => t.skill_set_name),
              Object.fromEntries(items.map((i) => [i.skill_set_name, i.postings]))
          )
        : null;

    return {
        program,
        careers,
        data: {
            postings: Number(counts?.postings || 0),
            postings_with_skills: postingsWithSkills,
            // none | low (<20) | moderate (20-49) | good (50+)
            confidence: confidenceFor(postingsWithSkills),
        },
        coverage: {
            // demand-weighted %: how much of what employers ask for is taught
            percent: totalMentions ? Math.round((coveredMentions / totalMentions) * 100) : null,
            // TF-IDF cosine similarity, 0-1 (null if unavailable)
            cosine,
            in_demand: items.length,
            covered: covered.length,
            gaps: gaps.length,
            taught: taughtRows.length,
        },
        covered,
        gaps,
        unused,
        emerging: emerging.map((e) => ({ id: e.id, name: e.display_name, postings: Number(e.postings) })),
    };
}

// One row per program for the admin overview
export async function getAlignmentOverview() {
    const programs = await q("SELECT program_id FROM Programs ORDER BY program_code", []);
    const rows = [];

    for (const { program_id } of programs) {
        const a = await getProgramAlignment(program_id);
        rows.push({
            program: a.program,
            careers: a.careers.length,
            postings: a.data.postings,
            postings_with_skills: a.data.postings_with_skills,
            confidence: a.data.confidence,
            coverage_percent: a.coverage.percent,
            cosine: a.coverage.cosine,
            gaps: a.coverage.gaps,
            top_gaps: a.gaps.slice(0, 3).map((g) => g.skill_set_name),
        });
    }

    return rows;
}
