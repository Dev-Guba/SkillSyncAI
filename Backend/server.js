
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

const app = express();

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(express.json());

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

startServer();
