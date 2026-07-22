import express from "express";
import { createUserJobTitleController } from "../controller/UserJobTitleController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-user-jobtitle",verifyToken,createUserJobTitleController
);

export default router;