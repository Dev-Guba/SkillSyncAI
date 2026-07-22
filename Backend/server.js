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
import ai from "./src/routes/ai.route.js"

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(express.json());

app.use("/api/auth", login);
app.use("/api/user", create);
app.use("/api/user-profile", profile);
app.use("/api/skills", skills);
app.use("/api/user-skills", userSkills);
app.use("/api/interest", interest);
app.use("/api/job", jobTitle)
app.use("/api/ai", ai);

async function startServer() {
  try {
    // Test database connection
    await db.authenticate();
    console.log("✅ Connected to MySQL successfully.");

    // Create all tables
    await db.sync();
    console.log("✅ Database synchronized.");

    app.listen(3000, () => {
      console.log("🚀 Server is running on port 3000");
    });
  } catch (error) {
    console.error("❌ Failed to start server:");
    console.error(error);
  }
}

startServer();