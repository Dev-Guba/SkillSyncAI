import { 
    getAllPrograms,
    getProgramSkills,
    getProgramJobTitles,
 } from "../services/programServices.js";

export async function handleGetAllProgram(req, res){
    try {
    const data = await getAllPrograms();

    return res.status(200).json({
        success: true,
        message: "Fetch all program successfully",
        data: data
    });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
    }
}

// GET PROGRAM SKILLS
export async function handleGetProgramSkills(req,res){

    try {

        const { program_id } = req.params;


        const skills = await getProgramSkills(program_id);


        return res.status(200).json({
            success:true,
            message:"Fetch program skills successfully",
            data:skills
        });


    } catch(error){

        console.error(error);

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

}



// GET PROGRAM JOB TITLES
export async function handleGetProgramJobTitles(req,res){

    try {

        const { program_id } = req.params;


        const jobTitles = await getProgramJobTitles(program_id);


        return res.status(200).json({
            success:true,
            message:"Fetch program job titles successfully",
            data:jobTitles
        });


    } catch(error){

        console.error(error);


        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

}