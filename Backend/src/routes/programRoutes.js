import express from "express";
import {
    handleGetAllProgram,
    handleGetProgramSkills,
    handleGetProgramJobTitles
} from "../controller/programController.js";

const router = express.Router();


router.get("/getProgram", handleGetAllProgram);
router.get("/:program_id/skills",handleGetProgramSkills);
router.get("/:program_id/jobtitles",handleGetProgramJobTitles);


export default router;