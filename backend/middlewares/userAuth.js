import jwt from "jwtwebtoken";
const userVerify = async (req, res, next) => {
  try {
    const token = req.header?.token || req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Authorized" });
    }
    let decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    req.id = decode.user_id;
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

export { userVerify };
