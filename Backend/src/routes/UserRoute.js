import { createUserController, getMe, getUsers } from "../controller/UserController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import express from "express";

const route = express.Router();

route.post("/create", verifyToken, createUserController);

route.get("/me", verifyToken, getMe)
route.get("/all", getUsers);

export default route;