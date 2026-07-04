import express from "express";

import { createProfile } from "../controller/UserProfileController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-profile", verifyToken ,createProfile);

export default router;