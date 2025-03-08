import express from "express";
import { isAuthenticated } from "../middlewares/userAuth.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/send/:id", isAuthenticated, sendMessage);
messageRouter.get("/all/:id", isAuthenticated, getMessage);

export { messageRouter };
