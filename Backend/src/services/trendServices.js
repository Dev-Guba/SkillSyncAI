import { Op, fn, col, literal } from "sequelize";

import JobSkill from "../model/JobSkill.js";
import Jobs from "../model/Jobs.js";
import SkillSet from "../model/SkillSet.js";
import ProgramJobTitle from "../model/ProgramJobTitle.js";

import { forecastSkillDemand } from "./ai.services.js";

export async function getMonthlySkillDemand(program_id = null) {
    try {
        const jobWhere = {
            posted_date: {
                [Op.ne]: null
            }
        };

        // Filter jobs based on the program's related job titles
        if (program_id) {
            const programJobTitles = await ProgramJobTitle.findAll({
                where: {
                    program_id
                },
                attributes: ["job_title_id"],
                raw: true
            });

            const jobTitleIds = programJobTitles.map(
                item => item.job_title_id
            );

            // No related job titles
            if (jobTitleIds.length === 0) {
                return [];
            }

            jobWhere.job_title_id = {
                [Op.in]: jobTitleIds
            };
        }

        const results = await JobSkill.findAll({
            attributes: [
                "skill_set_id",
                [
                    fn(
                        "COUNT",
                        col("JobSkill.job_id")
                    ),
                    "demand"
                ],
                [
                    literal(
                        "DATE_FORMAT(`job`.`posted_date`, '%Y-%m')"
                    ),
                    "month"
                ]
            ],

            include: [
                {
                    model: Jobs,
                    as: "job",
                    attributes: [],
                    required: true,
                    where: jobWhere
                },
                {
                    model: SkillSet,
                    as: "skill",
                    attributes: ["skill_set_name"],
                    required: true
                }
            ],

            group: [
                "skill_set_id",
                literal(
                    "DATE_FORMAT(`job`.`posted_date`, '%Y-%m')"
                ),
                "skill.skill_set_id",
                "skill.skill_set_name"
            ],

            order: [
                [
                    literal(
                        "DATE_FORMAT(`job`.`posted_date`, '%Y-%m')"
                    ),
                    "ASC"
                ]
            ]
        });

        return results;

    } catch (error) {
        console.error(
            "Monthly Skill Demand Error:",
            error
        );

        throw error;
    }
}

export async function getSkillTrends(program_id = null) {
    try {

        const monthlyData =
            await getMonthlySkillDemand(program_id);

        const skillMap = new Map();


        for (const row of monthlyData) {

            const skill =
                row.skill?.skill_set_name;

            const month =
                row.get("month");

            const demand =
                Number(row.get("demand"));


            if (!skill || !month) {
                continue;
            }


            if (!skillMap.has(skill)) {
                skillMap.set(skill, []);
            }


            skillMap.get(skill).push({
                month: String(month),
                demand
            });
        }


        const trends = [];


        for (const [skill, history] of skillMap) {

            history.sort(
                (a, b) =>
                    String(a.month).localeCompare(
                        String(b.month)
                    )
            );


            const current =
                history[history.length - 1];


            const previous =
                history.length > 1
                    ? history[history.length - 2]
                    : null;


            let growthPercentage = null;
            let trend = "New";


            if (previous) {

                if (previous.demand === 0) {

                    growthPercentage = null;

                } else {

                    growthPercentage =
                        (
                            (
                                current.demand -
                                previous.demand
                            ) /
                            previous.demand
                        ) * 100;


                    growthPercentage =
                        Number(
                            growthPercentage.toFixed(2)
                        );
                }


                if (
                    current.demand >
                    previous.demand
                ) {

                    trend = "Increasing";

                } else if (
                    current.demand <
                    previous.demand
                ) {

                    trend = "Decreasing";

                } else {

                    trend = "Stable";
                }
            }


            trends.push({

                skill,

                current_month:
                    current.month,

                current_demand:
                    current.demand,

                previous_month:
                    previous?.month || null,

                previous_demand:
                    previous?.demand ?? null,

                growth_percentage:
                    growthPercentage,

                trend,

                history
            });
        }


        return trends;

    } catch (error) {

        console.error(
            "Skill Trend Analysis Error:",
            error
        );

        throw error;
    }
}

export async function getSkillForecasts(periods = 3, program_id = null) {
    try {
        const monthlyData = await getMonthlySkillDemand(program_id);

        const skillMap = new Map();

        for (const row of monthlyData) {
            const skill = row.skill?.skill_set_name;
            const month = row.get("month");
            const demand = Number(row.get("demand"));

            if (!skill || !month) {
                continue;
            }

            if (!skillMap.has(skill)) {
                skillMap.set(skill, []);
            }

            skillMap.get(skill).push({
                month: String(month),
                demand
            });
        }

        const forecasts = [];

        for (const [skill, history] of skillMap) {

            history.sort(
                (a, b) =>
                    a.month.localeCompare(b.month)
            );

            // Need at least 2 historical observations
            if (history.length < 2) {
                forecasts.push({
                    skill,
                    history,
                    forecast: [],
                    status: "Insufficient historical data"
                });

                continue;
            }

            const forecast = await forecastSkillDemand(
                history,
                periods
            );

            forecasts.push({
                skill,
                history,
                forecast,
                status: "Forecast generated"
            });
        }

        return forecasts;

    } catch (error) {
        console.error(
            "Skill Forecast Error:",
            error
        );

        throw error;
    }
}