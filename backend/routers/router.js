import express from "express";
import { userRouter } from "./userRouter.js";
import { postRouter } from "./postRouter.js";
import { messageRouter } from "./messageRoute.js";

const router = express.Router();
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/message", messageRouter);

export { router };
