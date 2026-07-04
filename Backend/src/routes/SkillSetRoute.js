import express  from "express";

import { getSkillSets } from "../controller/SkillSetController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/skillsets", verifyToken, getSkillSets);

export default router;