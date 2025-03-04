import express from "express";
import {
  editProfile,
  followOrunfollow,
  getProfile,
  getSuggestedUser,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();
userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userLogout);
userRouter.get("/profile/:id", isAuthenticated, getProfile);
userRouter.post("followorunfollow/:id", isAuthenticated, followOrunfollow);
userRouter.post(
  "/profile/update",
  isAuthenticated,
  upload.single("profilePicture"),
  editProfile
);
userRouter.get("/suggested", isAuthenticated, getSuggestedUser);

export { userRouter };
