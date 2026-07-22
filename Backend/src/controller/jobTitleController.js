import { getJobSkillsForAI } from "../services/jobTitleServices.js";

export async function testJobSkills(req,res){

    const skills = await getJobSkillsForAI(
        req.params.id
    );

    res.json(skills);

}