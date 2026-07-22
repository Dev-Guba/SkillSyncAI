import express from "express";
import Role from "../model/Role.js";
import User from "../model/User.js";
import {SkillSet, UserProfile, UserSkill, JobTitle} from "../model/relation.js";
import bcrypt from "bcrypt";

export async function createUser(username, password, role_id, created_at, updated_at) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashedPassword,
        role_id,
        created_at,
        updated_at
    });
    
    return user;
}

export async function getSelfUser(user_id) {
  return await User.findOne({
    where: { user_id },

    attributes: {
      exclude: ["password"],
    },

    include: [
      {
        model: UserProfile,
      },

      {
        model: SkillSet,
        through: {
          attributes: ["proficiency_level"],
        },
      },

      {
        model: JobTitle,
        attributes: [
          "job_title_id",
          "job_title_name",
        ],
      },
    ],
  });
}