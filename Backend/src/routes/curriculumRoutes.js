import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getProgramAlignment, getAlignmentOverview } from "../services/curriculumServices.js";

// /api/curriculum — curriculum alignment (Objective 2.4)
const router = express.Router();

function handler(fn, failMessage) {
    return async (req, res) => {
        try {
            return res.status(200).json({ success: true, data: await fn(req) });
        } catch (error) {
            if (!error.status) console.error(`${failMessage}:`, error);
            return res.status(error.status || 500).json({
                success: false,
                message: error.status ? error.message : `${failMessage}. Please try again.`,
            });
        }
    };
}

// Any logged-in user: aggregate data about a program (no personal data)
router.get(
    "/programs/:program_id",
    verifyToken,
    handler((req) => getProgramAlignment(req.params.program_id), "Couldn't load curriculum alignment")
);

// Admins: every program at a glance
router.get(
    "/overview",
    verifyToken,
    requireAdmin,
    handler(() => getAlignmentOverview(), "Couldn't load the curriculum overview")
);

export default router;
