import express from "express";

const router = express.Router();

import { login } from "../controller/auth/loginAuth.js";

router.post("/login", login);

export default router;