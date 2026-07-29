import Role from "./Role.js";
import User from "./User.js";
import UserProfile from "./UserProfile.js";
import SkillSet from "./SkillSet.js";
import JobTitle from "./JobTitle.js";
import JobTitleSkill from "./JobTitleSkill.js";
import UserSkill from "./UserSkill.js";
import UserInterest from "./UserInterest.js";
import UserJobTitle from "./UserJobTitle.js";
import Interests from "./Interests.js";

import Program from "./Program.js";
import ProgramSkills from "./ProgramSkills.js";

import ProgramJobTitle from "./ProgramJobTitle.js";


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
| Program <-> UserProfile
|--------------------------------------------------------------------------
*/

Program.hasMany(UserProfile, {
  foreignKey: "program_id",
});

UserProfile.belongsTo(Program, {
  foreignKey: "program_id",
});


/*
|--------------------------------------------------------------------------
| User <-> SkillSet
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
| Program <-> SkillSet
|--------------------------------------------------------------------------
*/

Program.belongsToMany(SkillSet, {
  through: ProgramSkills,
  foreignKey: "program_id",
  otherKey: "skill_set_id",
});

SkillSet.belongsToMany(Program, {
  through: ProgramSkills,
  foreignKey: "skill_set_id",
  otherKey: "program_id",
});


/*
|--------------------------------------------------------------------------
| JobTitle <-> SkillSet
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
| User <-> JobTitle
|--------------------------------------------------------------------------
*/

User.belongsToMany(JobTitle, {
  through: UserJobTitle,
  foreignKey: "user_id",
  otherKey: "job_title_id",
});

JobTitle.belongsToMany(User, {
  through: UserJobTitle,
  foreignKey: "job_title_id",
  otherKey: "user_id",
});


/*
|--------------------------------------------------------------------------
| User <-> Interests
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

/*
|--------------------------------------------------------------------------
| Program <-> JobTitle
|--------------------------------------------------------------------------
*/

Program.belongsToMany(JobTitle,{
    through: ProgramJobTitle,
    foreignKey:"program_id",
    otherKey:"job_title_id"
});


JobTitle.belongsToMany(Program,{
    through: ProgramJobTitle,
    foreignKey:"job_title_id",
    otherKey:"program_id"
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
  UserJobTitle,
  Program,
  ProgramSkills,
  ProgramJobTitle,
};