import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Program = sequelize.define("Program", {

  program_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  program_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },

  program_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },

}, {
  tableName: "Programs",
  timestamps: true,
});


export default Program;