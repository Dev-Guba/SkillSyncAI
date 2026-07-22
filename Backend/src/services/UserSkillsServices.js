import sequelize  from "../config/db.js";
import { User ,UserSkill, SkillSet } from "../model/relation.js";

const VALID_PROFICIENCY_LEVELS = [
    "Beginner",
    "Intermediate",
    "Advanced",
];

function validateSkills(skills) {
    if (!Array.isArray(skills) || skills.length === 0) {
        throw new Error("Please provide at least one skill.");
    }

    const skillIds = skills.map((skill) => skill.skill_set_id);

    if (new Set(skillIds).size !== skillIds.length) {
        throw new Error("Duplicate skills are not allowed.");
    }

    for (const skill of skills) {
        if (!VALID_PROFICIENCY_LEVELS.includes(skill.proficiency_level)) {
            throw new Error(
                `Invalid proficiency level: ${skill.proficiency_level}`
            );
        }
    }
}

export async function getUserSkillsForAI(user_id){

    const user = await User.findByPk(user_id,{
        include:[
            {
                model: SkillSet,
                attributes:[
                    "skill_set_name"
                ],
                through:{
                    attributes:[
                        "proficiency_level"
                    ]
                }
            }
        ]
    });


    if (!user) {
        throw new Error("User not found");
    }


    return user.SkillSets.map(
        skill => ({
            skill: skill.skill_set_name,
            proficiency: skill.UserSkill.proficiency_level
        })
    );
}

export function formatSkillsForAI(skills){

    return skills.map(
        skill => skill.skill_set_name
    );

}

async function verifySkillSets(skillIds) {
    const existingSkills = await SkillSet.findAll({
        where: {
            skill_set_id: skillIds,
        },
    });

    if (existingSkills.length !== skillIds.length) {
        throw new Error("One or more skills do not exist.");
    }
}

export async function createUserSkills(user_id, skills) {
    try {
        validateSkills(skills);

        const skillIds = skills.map((skill) => skill.skill_set_id);

        await verifySkillSets(skillIds);

        const userSkills = skills.map((skill) => ({
            user_id,
            skill_set_id: skill.skill_set_id,
            proficiency_level: skill.proficiency_level,
        }));

        return await UserSkill.bulkCreate(userSkills);
    } catch (error) {
        console.error("Error creating user skills:", error);
        throw error;
    }
}

export async function updateUserSkills(user_id, skills) {
    const transaction = await sequelize.transaction();

    try {
        validateSkills(skills);

        const skillIds = skills.map((skill) => skill.skill_set_id);

        await verifySkillSets(skillIds);

        await UserSkill.destroy({
            where: {
                user_id,
            },
            transaction,
        });

        const userSkills = skills.map((skill) => ({
            user_id,
            skill_set_id: skill.skill_set_id,
            proficiency_level: skill.proficiency_level,
        }));

        await UserSkill.bulkCreate(userSkills, {
            transaction,
        });

        await transaction.commit();

        return await UserSkill.findAll({
            where: {
                user_id,
            },
        });
    } catch (error) {
        await transaction.rollback();

        console.error("Error updating user skills:", error);
        throw error;
    }
}