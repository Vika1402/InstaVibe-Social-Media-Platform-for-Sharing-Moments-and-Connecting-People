import { User } from "../models/user.model.js";

import { v2 as cloudinary } from "cloudinary";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { getReciverSocketId, io } from "../socket/socket.js";

const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const author_id = req.id;
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "post image required" });
    }
    const user = await User.findById(author_id);

    // const optimizedImageBuffer = await sharp(image.buffer)
    //   .resize({ width: 800, height: 800, fit: "inside" })
    //   .toFormat("jpeg", { quality: 80 })
    //   .toBuffer();
    // //buffer to data uri
    // const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
    //   "base64"
    // )}`;

    let cloudResponse = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    console.log(cloudResponse.secure_url);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: author_id,
    });

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    res.status(200).json({ success: true, post, message: "New Post Added" });
  } catch (error) {
    console.log(error);
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        // populate: {
        //   path: "author",
        //   select: "username profilePicture",
        // },
      });

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error);
  }
};

const getUserPost = async (req, res) => {
  try {
    const author_id = req.id;
    const posts = await Post.find({ author: author_id })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username,profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username,profilePicture",
        },
      });
    return res.status(200).json({ success: true, posts });
  } catch (error) {}
};

const likePost = async (req, res) => {
  const likekrnewalauser = req.id;
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404).json({ success: false, message: "Post not found" });
  }

  //like logics here
  await post.updateOne({ $addToSet: { likes: likekrnewalauser } });
  await post.save();

  //implement socket io for realtime notification
  const user = await User.findById(likekrnewalauser).select(
    "username profilePicture"
  );
  const postOwnerId = post.author.toString();
  if (postOwnerId !== likekrnewalauser) {
    const notification = {
      type: "like",
      userId: likekrnewalauser,
      userDetails: user,
      postId,
      message: "your post was liked",
    };
    const postOwnerSocketId = getReciverSocketId(postOwnerId);
    io.to(postOwnerSocketId).emit("notification", notification);
  }

  return res.status(200).json({ success: true, message: "post liked " });
};
const disLikePost = async (req, res) => {
  const likekrnewalauser = req.id;
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404).json({ success: false, message: "Post not found" });
  }

  //like logics here
  await post.updateOne({ $pull: { likes: likekrnewalauser } });
  await post.save();

  //implement socket io for realtime notification
  const user = await User.findById(likekrnewalauser).select(
    "username profilePicture"
  );
  const postOwnerId = post.author.toString();
  if (postOwnerId !== likekrnewalauser) {
    const notification = {
      type: "dislike",
      userId: likekrnewalauser,
      userDetails: user,
      postId,
      message: "your post was disliked",
    };
    const postOwnerSocketId = getReciverSocketId(postOwnerId);
    io.to(postOwnerSocketId).emit("notification", notification);
  }
  return res.status(200).json({ success: true, message: "post disliked " });
};

const addComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id; // Renamed for clarity
    const { content } = req.body;

    // Validate content
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const user = await User.findById(userId);

    // Create the comment
    const comment = await Comment.create({
      content,
      author: userId,
      post: postId,
    });

    // Populate author details after creation
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    // Add the comment to the post
    post.comments.push(comment._id);
    await post.save();

    return res
      .status(200)
      .json({ success: true, message: "Comment Added", comment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error, try again later" });
  }
};

const getCommentsPostWise = async () => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author username profilePicture"
    );
    if (!comments) {
      return res
        .status(404)
        .json({ success: false, message: "No Comment found for this post " });
    }
    return res.status(200).json({ success: true, comments });
  } catch (error) {}
};
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    console.log(postId, authorId);

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not Found", success: false });
    }
    //console.log(post.author);

    if (post.author.toString() !== authorId) {
      return res
        .status(403)
        .json({ success: false, message: "user not authorized" });
    }

    await Post.findByIdAndDelete(postId);
    let user = await User.findById(authorId);

    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ success: true, message: "post deleted" });
  } catch (error) {
    console.log(error);
  }
};

const savedPost = async (req, res) => {
  const postId = req.params.id;
  const authorId = req.id;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not Found", success: false });
  }
  const user = await User.findById(authorId);
  if (user.savedPost.includes(post._id)) {
    await user.updateOne({ $pull: { savedPost: post._id } });
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "saved Post removed", type: "unsaved" });
  } else {
    await user.updateOne({ $addToSet: { savedPost: post._id } });
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Post Saved", type: "saved" });
  }
};

export {
  getAllPost,
  getUserPost,
  addNewPost,
  likePost,
  disLikePost,
  addComments,
  getCommentsPostWise,
  deletePost,
  savedPost,
};
