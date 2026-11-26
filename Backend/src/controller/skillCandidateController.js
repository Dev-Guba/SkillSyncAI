import {
    listCandidates,
    scanEmergingSkills,
    approveCandidate,
    mergeCandidate,
    rejectCandidate,
    reopenCandidate,
} from "../services/skillDiscoveryServices.js";
import { reanalyzeSavedJobSkills } from "../services/jobServices.js";

function handler(fn, failMessage) {
    return async (req, res) => {
        try {
            const data = await fn(req);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            if (!error.status) console.error(`${failMessage}:`, error.response?.data || error);
            return res.status(error.status || 500).json({
                success: false,
                message: error.status ? error.message : `${failMessage}. Please try again.`,
            });
        }
    };
}

const adminFrom = (req) => ({ user_id: req.user.user_id, username: req.user.username });

const STATUSES = new Set(["pending", "approved", "merged", "rejected", "all"]);

export const getCandidates = handler(
    (req) => listCandidates(STATUSES.has(req.query.status) ? req.query.status : "pending"),
    "Couldn't load skill suggestions"
);

export const postScan = handler(() => scanEmergingSkills(), "Couldn't scan the job postings");

export const postApprove = handler(
    (req) => approveCandidate(adminFrom(req), req.params.id, req.body?.name),
    "Couldn't approve the skill"
);

export const postMerge = handler(
    (req) => mergeCandidate(adminFrom(req), req.params.id, req.body?.skill_set_id),
    "Couldn't merge the skill"
);

export const postReject = handler(
    (req) => rejectCandidate(adminFrom(req), req.params.id),
    "Couldn't reject the skill"
);

// Re-extract skills for all saved job postings with the current rules/catalog
export const postReanalyzeJobs = handler(
    () => reanalyzeSavedJobSkills(),
    "Couldn't re-analyze the saved jobs"
);

export const postReopen = handler(
    (req) => reopenCandidate(req.params.id),
    "Couldn't reopen the skill"
);
