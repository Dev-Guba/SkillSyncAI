import Role from "./Role.js";
import User from "./User.js";
import UserProfile from "./UserProfile.js";
import SkillSet from "./SkillSet.js";
import JobTitle from "./JobTitle.js";
import JobTitleSkill from "./JobTitleSkill.js";
import UserSkill from "./UserSkill.js";
import UserInterest from "./UserInterest.js";
import Interests from "./Interests.js";

/*
|--------------------------------------------------------------------------
| Role <-> User
|--------------------------------------------------------------------------
*/

Role.hasMany(User, {
  foreignKey: "role_id",
});

User.belongsTo(Role, {
  foreignKey: "role_id",
});

/*
|--------------------------------------------------------------------------
| User <-> UserProfile
|--------------------------------------------------------------------------
*/

User.hasOne(UserProfile, {
  foreignKey: "user_id",
});

UserProfile.belongsTo(User, {
  foreignKey: "user_id",
});

/*
|--------------------------------------------------------------------------
| User <-> SkillSet (Many-to-Many)
|--------------------------------------------------------------------------
*/

User.belongsToMany(SkillSet, {
  through: UserSkill,
  foreignKey: "user_id",
  otherKey: "skill_set_id",
});

SkillSet.belongsToMany(User, {
  through: UserSkill,
  foreignKey: "skill_set_id",
  otherKey: "user_id",
});

/*
|--------------------------------------------------------------------------
| JobTitle <-> SkillSet (Many-to-Many)
|--------------------------------------------------------------------------
*/

JobTitle.belongsToMany(SkillSet, {
  through: JobTitleSkill,
  foreignKey: "job_title_id",
  otherKey: "skill_set_id",
});

SkillSet.belongsToMany(JobTitle, {
  through: JobTitleSkill,
  foreignKey: "skill_set_id",
  otherKey: "job_title_id",
});

/*
|--------------------------------------------------------------------------
| User <-> Interest (Many-to-Many)
|--------------------------------------------------------------------------
*/

User.belongsToMany(Interests, {
  through: UserInterest,
  foreignKey: "user_id",
  otherKey: "interest_id",
});

Interests.belongsToMany(User, {
  through: UserInterest,
  foreignKey: "interest_id",
  otherKey: "user_id",
});

export {
  Role,
  User,
  UserProfile,
  SkillSet,
  JobTitle,
  JobTitleSkill,
  UserSkill,
  Interests,
  UserInterest,
};