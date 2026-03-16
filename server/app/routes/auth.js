import { Router } from "express";
import { body } from "express-validator";
import { register, login, getMe } from "../controllers/authController.js";
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

export default router;
