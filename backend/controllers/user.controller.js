import { User } from "../models/user.model.js";
import { connectCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { getDataUri } from "../utils/datauri.js";
import { upload } from "../middlewares/multer.js";
import { Post } from "../models/post.model.js";
const userRegister = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Plese fill all required fields" });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "User & email Already registerd Plese Login.. ",
    });
  }

  let hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    username,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    message: "User registerd Successfully",
    newUser: {
      email: newUser.email,
      username: newUser.username,
    },
  });
};
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Plese fill all required fields" });
  }
  let user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User & email not found" });
  }
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Plese Enter Correct Password " });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  const cookiesOption = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
  };
  //populates is post id the post array
  const populatedPost = await Promise.all(
    user.posts.map(async (postId) => {
      const post = await Post.findById(postId);
      if (post && post.author.equals(user._id)) {
        return post;
      } else {
        return null;
      }
    })
  );
  user = {
    _id: user._id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePicture: user.profilePicture,
    followers: user.followers,
    following: user.following,
    posts: populatedPost,
    savedPost: user.savedPost,
  };

  res.status(200).cookie("token", token, cookiesOption).json({
    success: true,
    message: "User Logged In Successfully..",
    user,
    token,
  });
};

const userLogout = async (req, res) => {
  try {
    return res.clearCookie("token").status(200).json({
      success: true,
      message: "User Logged Out Successfully..",
    });
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  const userId = req.params.id;
  let user = await User.findById(userId);
  return res.status(200).json({ success: true, user });
};

const editProfile = async (req, res) => {
  const userId = req.id;
  const { bio, gender } = req.body;
  let profilePicture = req.file;
  let cloudResponse;
  if (profilePicture) {
    try {
      cloudResponse = await cloudinary.uploader.upload(profilePicture.path, {
        resource_type: "image",
      });
      console.log("Image Uploaded:", cloudResponse.secure_url);
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }
  }

  //console.log(userId);

  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }
  if (bio) {
    user.bio = bio;
  }
  if (gender) {
    user.gender = gender;
  }
  if (profilePicture) {
    user.profilePicture = cloudResponse.secure_url;
  }

  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Profile updated..", user });
};

const getSuggestedUser = async (req, res) => {
  const suggestedUser = await User.find({ _id: { $ne: req.id } }).select(
    "-password"
  );
  if (!suggestedUser) {
    return res
      .status(400)
      .json({ success: false, message: "No Suggested User Found.." });
  }

  return res.status(200).json({ success: true, suggestedUser });
};

const followOrunfollow = async () => {
  try {
    const followers = req.id; //jo mujhe folloow kr raha hai
    const following = req.params.id; // jise me follow krta hu

    if (followers === following) {
      return res.status(400).json({
        success: false,
        message: "You can't follow & unfollow yourself",
      });
    }
    const user = await User.findById(followers);
    const targetUser = await User.findById(following);
    if (!user || !targetUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    //check follow or not follow

    const isFollowing = user.following.includes(following);

    if (isFollowing) {
      //unfollow logics
      await Promise.all([
        User.findByIdAndUpdate(
          { _id: following },
          { $pull: { following: following } }
        ),
        User.findByIdAndUpdate(
          { _id: followers },
          { $pull: { followers: followers } }
        ),
      ]);
      res
        .status(200)
        .json({ success: true, message: "User Unfollowed Successfully.." });
    } else {
      //follow logics here
      await Promise.all([
        User.findByIdAndUpdate(
          { _id: following },
          { $push: { following: following } }
        ),
        User.findByIdAndUpdate(
          { _id: followers },
          { $push: { followers: followers } }
        ),
      ]);
      res
        .status(200)
        .json({ success: true, message: "User Followed Successfully.." });
    }
  } catch (error) {
    console.log(error);
  }
};
export {
  userRegister,
  userLogin,
  userLogout,
  followOrunfollow,
  getProfile,
  editProfile,
  getSuggestedUser,
};
