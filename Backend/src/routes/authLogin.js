import { login } from "../controller/auth/loginAuth.js";
import { registerAccount } from "../controller/auth/registerAccount.js";
import express from "express";

// Password recovery controller
import {
    requestOTP,
    verifyOTP,
    resetPassword
} from "../controller/auth/passwordReset.js";
const router = express.Router();

// Login and Registration   
router.post("/login", login);
router.post("/register", registerAccount);

// Password Recovery
router.post("/forgot-password", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;