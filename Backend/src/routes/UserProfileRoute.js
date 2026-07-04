import express from "express";

import { 
    createProfile,
    handleUpdateUserProfile
 } from "../controller/UserProfileController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-profile", verifyToken ,createProfile);
router.put("/update-user",verifyToken, handleUpdateUserProfile )

export default router;