
import db from "./src/config/db.js";
import "./src/model/relation.js";

import express from "express";
import cors from "cors";

import login from "./src/routes/authLogin.js";
import create from "./src/routes/UserRoute.js";
import profile from "./src/routes/UserProfileRoute.js";
import skills from "./src/routes/SkillSetRoute.js";
import userSkills from "./src/routes/UserSkills.js";
import interest from "./src/routes/userInterestRoute.js";
import jobTitle from "./src/routes/jobTitleRoutes.js";
import userJobTitleRoutes from "./src/routes/UserJobTitleRoutes.js";
import program from "./src/routes/programRoutes.js";
import ai from "./src/routes/ai.route.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import trendRoutes from "./src/routes/trendRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import adminUserRoutes from "./src/routes/adminUserRoutes.js";
import skillCandidateRoutes from "./src/routes/skillCandidateRoutes.js";
import curriculumRoutes from "./src/routes/curriculumRoutes.js";
import { runScheduledImport } from "./src/services/jobServices.js";

import { testEmailConnection } from "./src/services/emailServices.js";

const app = express();

// Render sits behind one proxy; this makes req.ip the visitor's real address
// (used by the contact form's rate limit).
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://skillsyncai-2-lh2y.onrender.com",
  "https://skillsyncai.site",
  "https://www.skillsyncai.site",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);

// 1mb leaves room for profile pictures (sent as base64 data URLs)
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSyncAI Backend API is running!",
  });
});

app.use("/api/auth", login);
app.use("/api/user", create);
app.use("/api/user-profile", profile);
app.use("/api/skills", skills);
app.use("/api/user-skills", userSkills);
app.use("/api/interest", interest);
app.use("/api/job", jobTitle);
app.use("/api/user-job-title", userJobTitleRoutes);
app.use("/api/program", program);
app.use("/api/ai", ai);
app.use("/api/jobs", jobRoutes);
app.use("/api/trends", trendRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/skill-candidates", skillCandidateRoutes);
app.use("/api/curriculum", curriculumRoutes);

// Optional in-process schedule for job collection (Objective 2.1), e.g.
// SCHEDULED_IMPORT_INTERVAL_HOURS=24. On Render's free plan the server
// sleeps when idle, so use a Render Cron Job calling
// POST /api/jobs/scheduled-import (header X-Cron-Secret) as well.
const importEveryHours = Number(process.env.SCHEDULED_IMPORT_INTERVAL_HOURS);
if (importEveryHours > 0) {
    setInterval(() => {
        runScheduledImport().catch((error) =>
            console.error("Scheduled import run failed:", error)
        );
    }, importEveryHours * 60 * 60 * 1000);
    console.log(`Job collection scheduled every ${importEveryHours}h`);
}

async function startServer() {
  try {
    await db.authenticate();

    console.log("Connected to MySQL successfully.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`SkillSyncAI backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
testEmailConnection();
startServer();
