import express from "express";

import { addInterestController } from "../controller/userInterestController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-interest", verifyToken, addInterestController);


export default router;