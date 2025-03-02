import { User } from "../models/user.model";

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

  res
    .cookies("token", token, cookiesOption)
    .status(200)
    .json({
      success: true,
      message: "User Logged In Successfully..",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
};
