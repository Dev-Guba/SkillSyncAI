import express from "express";
import { handleContactMessage } from "../controller/contactController.js";

const router = express.Router();

// Public: the landing page's Contact form
router.post("/", handleContactMessage);

export default router;
