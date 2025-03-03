import { User } from "../models/user.model.js";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { Post } from "../models/post.model.js";
const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const { image } = req.file;
    const author_id = req.id;
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "post image required" });
    }
    const user = await User.findById(author_id);
    //image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();
    //buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
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
      .populate({ path: "author", select: "username,  profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username,profilePicture",
        },
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

export { getAllPost, getUserPost, addNewPost };
