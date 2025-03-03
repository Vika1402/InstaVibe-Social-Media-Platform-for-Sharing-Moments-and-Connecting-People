import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.headers["authorization"]?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Authorized" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decode);

    req.id = decode.id;

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
};

export { isAuthenticated };
