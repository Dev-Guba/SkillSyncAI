import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserJobTitle = sequelize.define(
  "UserJobTitle",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    job_title_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "UserJobTitle",
    timestamps: false,
  }
);

export default UserJobTitle;