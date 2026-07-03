import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserProfile = sequelize.define("UserProfile", {
  user_profile_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: DataTypes.INTEGER,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  phone_number: DataTypes.STRING,
  birth_date: DataTypes.DATE,
  gender: DataTypes.ENUM("Male", "Female", "Other"),
  bio: DataTypes.TEXT,
  location: DataTypes.STRING,
}, {
  tableName: "User_Profile",
  timestamps: false,
});

export default UserProfile;