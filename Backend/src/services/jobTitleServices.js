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

export async function getJobTitleForJobs(job_title_id) {

const jobTitle = await JobTitle.findByPk(
    job_title_id
);

if (!jobTitle) {
    throw new Error("Job title not found");
}

return {
    job_title_id: jobTitle.job_title_id,
    job_title_name: jobTitle.job_title_name
};
}