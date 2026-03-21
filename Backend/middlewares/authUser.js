import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers["token"]; // token from headers

    if (!token) {
      return res.json({
        success: false,
        message: "Not authorized, login again",
      });
    }
    console.log("Token received:", token);
    console.log("Secret used for verification:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id }; // store as an object

    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Invalid or expired token" });
  }
};
