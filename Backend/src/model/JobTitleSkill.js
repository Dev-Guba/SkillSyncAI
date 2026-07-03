import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const JobTitleSkill = sequelize.define("JobTitleSkill", {
  job_title_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  skill_set_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: "Job_title_skills",
  timestamps: false,
});

export default JobTitleSkill;