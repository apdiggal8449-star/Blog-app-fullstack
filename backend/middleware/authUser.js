import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

//Authentication
export const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Check cookie
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    console.log("Middleware token:", token);

    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({ error: "User not authenticated" });
  }
};

//Authorization
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: `User with given role ${req.user.role} not allowed` });
    }
    next();
  };
};
