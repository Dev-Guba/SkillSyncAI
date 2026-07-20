import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Interests = sequelize.define("Interests", {
  interest_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  interest_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "Interests",
  timestamps: false,
});

export default Interests;