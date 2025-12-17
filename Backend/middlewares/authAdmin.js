import jwt from "jsonwebtoken"

export const authAdmin = (req, res, next) => {
  const atoken = req.headers['atoken'];

  if (!atoken) {
    console.log("Headers received:", atoken); // logs undefined
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
    req.user = { email: decoded.email };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

