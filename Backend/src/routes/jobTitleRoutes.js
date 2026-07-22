import express from "express";
import { testJobSkills } from "../controller/jobTitleController.js";

const router = express.Router();

router.get("/job-skills/:id", testJobSkills);

export default router;