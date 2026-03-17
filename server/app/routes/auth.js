import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2, max: 60 }),
    body("email").trim().isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  register,
);

router.post(
  "/login",
  [body("email").trim().isEmail(), body("password").notEmpty()],
  login,
);

router.get("/me", authenticate, getMe);

router.patch(
  "/profile",
  authenticate,
  [
    body("name").optional().trim().isLength({ min: 2, max: 60 }),
    body("currentPassword").optional().isLength({ min: 6 }),
    body("newPassword").optional().isLength({ min: 6 }),
  ],
  updateProfile,
);

export default router;
