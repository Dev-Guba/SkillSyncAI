import express from "express";

import {
createJob,
importJobsController,
importCebuJobsController,
getJobsByJobTitle,
importJobsByJobTitleController
} from "../controller/jobController.js";

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Job routes are working"
    });
});

router.post("/", createJob);
router.post("/import", importJobsController);
router.post("/import-cebu", importCebuJobsController);

router.get("/title/:job_title_id", getJobsByJobTitle);

router.post(
    "/title/:job_title_id/import",
    importJobsByJobTitleController
);

export default router;