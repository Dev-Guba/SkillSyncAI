import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserInterest = sequelize.define("UserInterest", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  interest_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "UserInterest",
  timestamps: false,
});

export default UserInterest;