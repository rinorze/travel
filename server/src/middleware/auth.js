import jwt from "jsonwebtoken";
import User from "../models/User.js";

const ADMIN_EMAIL = "rzeqiri03@gmail.com";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    if (user.email === ADMIN_EMAIL && user.role !== "admin") {
      await User.updateOne({ _id: user._id }, { role: "admin" });
      user.role = "admin";
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const requireAdmin = async (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.email?.toLowerCase() !== ADMIN_EMAIL)
  ) {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) req.user = user;
    }
  } catch (error) {
    // Ignore auth errors for optional auth
  }
  next();
};
