import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Jobs = sequelize.define("Job", {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  job_title_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  external_job_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },

  company: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },

  location: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },

  classification: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  subclassification: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  salary: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  employment_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },

  source: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  posted_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

}, {
  tableName: "Jobs",
  timestamps: true,
});

export default Jobs;