import express from "expres";
import { isAuthenticated } from "../middlewares/userAuth";
import { sendMessage } from "../controllers/message.controller";

const messageRouter = express.Router();

messageRouter.post("/send/:id", isAuthenticated, sendMessage);
messageRouter.post("/all/:id", isAuthenticated, sendMessage);
messageRouter.post("/:id", isAuthenticated, sendMessage);
export { messageRouter };
