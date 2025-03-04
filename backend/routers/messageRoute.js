import express from "express";
import { isAuthenticated } from "../middlewares/userAuth.js";
import { sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/send/:id", isAuthenticated, sendMessage);
messageRouter.post("/all/:id", isAuthenticated, sendMessage);

export { messageRouter };
