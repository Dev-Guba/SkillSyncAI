import { getJobSkillsForAI, getAllJobSkills } from "../services/jobTitleServices.js";

export async function testJobSkills(req,res){

    const skills = await getJobSkillsForAI(
        req.params.id
    );

    res.json(skills);

}

export async function handleGetAllJobTitle(req, res){
    try {
        const data = await getAllJobSkills();

        res.status(200).json({
            success: true,
            message: "Job title fetch successfully",
            data: data
        });
    } catch (error) {
        console.log("Internal Server Error", error);
        res.status(500);
    }
}