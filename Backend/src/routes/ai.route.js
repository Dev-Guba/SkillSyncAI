import express from "express";
import { handleAIRecommendation, getCareerRecommendations, getLearningRecommendations, extractSkillsFromJobs } from "../controller/ai.controller.js";


const router = express.Router();

    
router.post("/recommend",handleAIRecommendation);
router.post("/recommend/careers", getCareerRecommendations);
router.post("/recommend/learning", getLearningRecommendations);
router.post("/extract-job-skills",extractSkillsFromJobs);


export default router;