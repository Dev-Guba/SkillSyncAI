import express from "express";

const router = express.Router();

import { login } from "../controller/auth/loginAuth.js";
import { registerAccount } from "../controller/auth/registerAccount.js";

router.post("/login", login);
router.post("/register", registerAccount);

export default router;