import { User } from "../models/user.model";
import { connectCloudinary } from "../utils/cloudinary";

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

  res
    .status(201)
    .json({ success: true, message: "User registerd Successfully" }, newUser);
};

const userLogin = async (req, res) => {
  const { email, password } = req.boddy;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Plese fill all required fields" });
  }
  const user = await User.findOne({ email });
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
  user = {
    _id: user._id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePicture: user.profilePicture,
    followers: user.followers,
    following: user.following,
    posts: user.posts,
    savedPost: user.savedPost,
  };
  res.cookies("token", token, cookiesOption).status(200).json({
    success: true,
    message: "User Logged In Successfully..",
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
  if (profilePicture) {
    const fileUri = getDataUri(profilePicture).content;
    const cloudResponse = await connectCloudinary.uploader.upload(fileUri);
  }

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

export { userRegister, userLogin, userLogout };
