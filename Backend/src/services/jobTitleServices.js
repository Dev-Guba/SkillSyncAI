import { JobTitle, SkillSet } from "../model/relation.js";

export async function getAllJobSkills(){
    const jobTitles = await JobTitle.findAll();
    
    return jobTitles;
}


export async function getJobSkillsForAI(job_title_id){

    const job = await JobTitle.findByPk(
        job_title_id,
        {
            include:[
                {
                    model: SkillSet,
                    attributes:[
                        "skill_set_name"
                    ],
                    through:{
                        attributes:[]
                    }
                }
            ]
        }
    );


    if(!job){
        throw new Error("Job title not found");
    }


    return job.SkillSets.map(
        skill => skill.skill_set_name
    );

}