import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
    getCandidates,
    postScan,
    postApprove,
    postMerge,
    postReject,
    postReopen,
    postReanalyzeJobs,
} from "../controller/skillCandidateController.js";

// /api/admin/skill-candidates — emerging skills found in job postings
const router = express.Router();
router.use(verifyToken, requireAdmin);

router.get("/", getCandidates);               // ?status=pending|approved|merged|rejected|all
router.post("/scan", postScan);               // scan saved job postings now
router.post("/reanalyze-jobs", postReanalyzeJobs); // re-extract skills of saved postings
router.post("/:id/approve", postApprove);     // { name? }
router.post("/:id/merge", postMerge);         // { skill_set_id }
router.post("/:id/reject", postReject);
router.post("/:id/reopen", postReopen);

export default router;
