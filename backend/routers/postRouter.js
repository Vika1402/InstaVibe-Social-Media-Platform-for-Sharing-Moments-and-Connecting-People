import express from "express";
import {
  addComments,
  addNewPost,
  deletePost,
  disLikePost,
  getAllPost,
  getCommentsPostWise,
  getUserPost,
  likePost,
  savedPost,
} from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";

const postRouter = express.Router();

postRouter.post(
  "/add-post",
  isAuthenticated,
  upload.single("image"),
  addNewPost
);
postRouter.post("/get-all-post", getAllPost);
postRouter.get("/get-user-post", isAuthenticated, getUserPost);
postRouter.post("/like-post/:id", isAuthenticated, likePost);
postRouter.post("/dislike-post/:id", isAuthenticated, disLikePost);
postRouter.post("/add-comment/:id", addComments);
postRouter.get("/get-comment-postwise/:id", getCommentsPostWise);
postRouter.post("/delete-post/:id", isAuthenticated, deletePost);
postRouter.post("/saved-post/:id",isAuthenticated, savedPost);

export { postRouter };
