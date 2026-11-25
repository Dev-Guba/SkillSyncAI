import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
    getAllAccounts,
    postAccount,
    patchRole,
    patchStatus,
    postPasswordReset,
    removeAccount,
    getActions,
} from "../controller/adminUserController.js";

// /api/admin/users — admin-only account management
const router = express.Router();
router.use(verifyToken, requireAdmin);

router.get("/", getAllAccounts);
router.post("/", postAccount);
router.get("/actions", getActions);
router.patch("/:user_id/role", patchRole);
router.patch("/:user_id/status", patchStatus);
router.post("/:user_id/password-reset", postPasswordReset);
router.delete("/:user_id", removeAccount);

export default router;
