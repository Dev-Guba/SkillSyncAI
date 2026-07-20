import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserSkill = sequelize.define("UserSkill", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  skill_set_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  proficiency_level: {
    type: DataTypes.ENUM(
      "Beginner",
      "Intermediate",
      "Advanced",
      "Expert"
    ),
    allowNull: false,
  },
}, {
  tableName: "User_Skills",
  timestamps: false,
});

export default UserSkill;