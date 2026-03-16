import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Please check your input.",
      errors: errors.array(),
    });
  }

  try {
    const { name, password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Account created successfully.",
      user: { _id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create account." });
  }
};

export const login = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Please check your input.",
      errors: errors.array(),
    });
  }

  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    return res.json({
      message: "Logged in successfully.",
      user: { _id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in." });
  }
};

export const getMe = async (req, res) => {
  return res.json({ user: req.user });
};
