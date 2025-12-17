
// export const authDoctor = (req, res, next) => {
//   try {
//     const token = req.headers["dtoken"]; // must match frontend exactly
//     console.log("Headers received:", token);
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Token missing" });
//     }

//     const { id } = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id };

//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ success: false, message: "Token expired" });
//     }
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };



// backend/middleware/authDoctor.js
import jwt from "jsonwebtoken";

export const authDoctor = (req, res, next) => {
  try {
    let token = req.headers.dtoken || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

