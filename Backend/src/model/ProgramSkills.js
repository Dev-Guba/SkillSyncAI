import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProgramSkills = sequelize.define("ProgramSkills", {

  program_skill_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  program_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  skill_set_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, {
  tableName: "Program_Skills",
  timestamps: true,
});


export default ProgramSkills;