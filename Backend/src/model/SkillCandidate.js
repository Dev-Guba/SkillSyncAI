import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// A skill-like term found in job postings that isn't in the catalog yet
export const SkillCandidate = sequelize.define("SkillCandidate", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    term: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    display_name: { type: DataTypes.STRING(100), allowNull: false },
    job_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    company_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    similar_skill_set_id: DataTypes.INTEGER,
    // pending | approved | merged | rejected
    status: { type: DataTypes.STRING(20), defaultValue: "pending" },
    skill_set_id: DataTypes.INTEGER,
    reviewed_by: DataTypes.STRING(50),
    reviewed_at: DataTypes.DATE,
    first_seen_at: DataTypes.DATE,
    last_seen_at: DataTypes.DATE,
}, {
    tableName: "Skill_Candidates",
    timestamps: false,
});

export const SkillCandidateJob = sequelize.define("SkillCandidateJob", {
    candidate_id: { type: DataTypes.INTEGER, primaryKey: true },
    job_id: { type: DataTypes.INTEGER, primaryKey: true },
}, {
    tableName: "Skill_Candidate_Jobs",
    timestamps: false,
});
