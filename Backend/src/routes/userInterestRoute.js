import express from "express";

import { addInterestController,getSuggestedInterests } from "../controller/userInterestController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-interest", verifyToken, addInterestController);
router.get("/suggest",verifyToken, getSuggestedInterests);

export default router;