import {
saveJob,
importJobs,
importCebuJobs,
importJobsByJobTitle,
fetchJobsByJobTitle,
} from "../services/jobServices.js";

export async function createJob(req, res) {
    try {
        const result = await saveJob(req.body);
        return res.status(result.created ? 201 : 200).json({
            success: true,
            message: result.created
                ? "Job created successfully"
                : "Job updated successfully",
            data: result.job
        });

    } catch (error) {
        console.error("Create Job Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}                                                                      

export async function importJobsController(req, res) {
    try {
        const result = await importJobs(req.body);
        return res.status(200).json({
            success: true,
            message: "Jobs imported successfully",
            data: result
        });
    } catch (error) {
        console.error("Import Jobs Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function importCebuJobsController(req, res) {

try {

    const result = await importCebuJobs();

    return res.status(200).json({
        success: true,
        message: "Cebu jobs imported successfully",
        data: result
    });

} catch (error) {

    console.error(
        "Import Cebu Jobs Error:",
        error
    );

    return res.status(500).json({
        success: false,
        message: error.message
    });

}

}

export async function getJobsByJobTitle(req, res) {
    try {
        const {
            job_title_id
        } = req.params;
        const result =
            await fetchJobsByJobTitle(
                job_title_id
            );
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error(
            "Fetch Jobs By Job Title Error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function importJobsByJobTitleController(req, res) {
    try {
        const {
            job_title_id
        } = req.params;
        const result =
            await importJobsByJobTitle(
                job_title_id
            );
        return res.status(200).json({
            success: true,
            message:
                "Jobs imported successfully",
            data: result
        });
    } catch (error) {
        console.error(
            "Import Jobs By Job Title Error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: error.message

        });
    }
}