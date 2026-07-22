import express from "express";
import { testJobSkills, handleGetAllJobTitle } from "../controller/jobTitleController.js";

const router = express.Router();

router.get("/job-skills/:id", testJobSkills);
router.get("/getAllJobTitle", handleGetAllJobTitle)

export default router;