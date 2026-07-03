import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SkillSet = sequelize.define("SkillSet", {
  skill_set_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  skill_set_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "Skill_set",
  timestamps: false,
});

export default SkillSet;