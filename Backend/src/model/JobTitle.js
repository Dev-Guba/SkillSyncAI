import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const JobTitle = sequelize.define("JobTitle", {
  job_title_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_title_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "Job_title",
  timestamps: false,
});

export default JobTitle;