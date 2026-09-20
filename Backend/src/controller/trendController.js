import {
    getMonthlySkillDemand,
    getSkillTrends,
    getSkillForecasts
} from "../services/trendServices.js";

export async function getMonthlySkillDemandController(req, res) {
    try {

        const results =
            await getMonthlySkillDemand();

        return res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {

        console.error(
            "Get Monthly Skill Demand Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function getSkillTrendsController(req, res) {
    try {

        const results =
            await getSkillTrends();

        return res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {

        console.error(
            "Get Skill Trends Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function getSkillForecastsController(req, res) {
    try {
        const periods = Number(req.query.periods);
        const program_id = Number(req.query.program_id);

        if (!Number.isInteger(periods) || periods < 1) {
            return res.status(400).json({
                success: false,
                message: "Periods must be a positive integer."
            });
        }

        if (!Number.isInteger(program_id) || program_id < 1) {
            return res.status(400).json({
                success: false,
                message: "Program ID is required."
            });
        }

        const results = await getSkillForecasts(
            periods,
            program_id
        );

        return res.status(200).json({
            success: true,
            periods,
            program_id,
            data: results
        });

    } catch (error) {
        console.error(
            "Get Skill Forecasts Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}