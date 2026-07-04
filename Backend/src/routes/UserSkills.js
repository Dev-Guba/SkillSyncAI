import { handleUserSkills } from "../controller/UserSkillsController.js";
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-skill", verifyToken, handleUserSkills);

export default router;