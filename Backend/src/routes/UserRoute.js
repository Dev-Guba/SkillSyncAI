import { createUserController } from "../controller/UserController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import express from "express";

const route = express.Router();

route.post("/create", verifyToken, createUserController);

export default route;