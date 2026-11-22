import express  from "express";

import { getSkillSets, createSkill, renameSkill } from "../controller/SkillSetController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/skillsets", verifyToken, getSkillSets);
router.post("/skillsets", createSkill);
router.put("/skillsets/:skill_set_id", renameSkill);

export default router;