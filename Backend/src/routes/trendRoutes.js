import express from "express";

import {
    getMonthlySkillDemandController,
    getSkillTrendsController,
    getSkillForecastsController
} from "../controller/trendController.js";

const router = express.Router();

router.get("/skills/monthly",getMonthlySkillDemandController);
router.get("/skills/trends",getSkillTrendsController);
router.get("/skills/forecast",getSkillForecastsController);

export default router;