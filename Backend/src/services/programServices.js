import Program from '../model/Program.js';
import { SkillSet, JobTitle } from "../model/relation.js";

export async function getAllPrograms(){
    const res = await Program.findAll();

    return res;
}

export const getProgramSkills = async (program_id) => {

    const program = await Program.findOne({

        where:{
            program_id
        },

        include:[
            {
                model: SkillSet,
                through:{
                    attributes:[]
                }
            }
        ]

    });


    if(!program){
        throw new Error("Program not found");
    }


    return program.SkillSets;

};



export const getProgramJobTitles = async(program_id)=>{

    const program = await Program.findOne({

        where:{
            program_id
        },

        include:[
            {
                model: JobTitle,
                as:"JobTitles",
                through:{
                    attributes:[]
                }
            }
        ]

    });


    if(!program){
        throw new Error("Program not found");
    }


    return program.JobTitles;

};