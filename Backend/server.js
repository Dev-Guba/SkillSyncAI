import db from './src/config/db.js';
import express from 'express';
import cors from 'cors';

import login from './src/routes/authLogin.js';
import create from './src/routes/UserRoute.js';
import profile from './src/routes/UserProfileRoute.js';
import skills from './src/routes/SkillSetRoute.js';
import userSkills from './src/routes/UserSkills.js';
import interest from './src/routes/userInterestRoute.js';

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
app.use("/api/interest", interest)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});