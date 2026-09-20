import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const JobSkill = sequelize.define(
    "JobSkill",
    {
        job_skill_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        job_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        skill_set_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "JobSkills",
        timestamps: true,
    }
);

export default JobSkill;