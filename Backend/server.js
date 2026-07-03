import db from './src/config/db.js';
import express from 'express';

import login from './src/routes/authLogin.js';
import create from './src/routes/UserRoute.js';
import profile from './src/routes/UserProfileRoute.js';

const app = express();
app.use(express.json());

app.use("/api/auth", login);
app.use("/api/user", create);
app.use("/api/user-profile", profile);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});