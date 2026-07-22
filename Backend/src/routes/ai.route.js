import express from "express";
import { handleAIRecommendation } from "../controller/ai.controller.js";


const router = express.Router();


router.post("/recommend",handleAIRecommendation
);


export default router;