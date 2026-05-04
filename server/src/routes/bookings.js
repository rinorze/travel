import { Router } from "express";
import { body } from "express-validator";
import {
  createBooking,
  listBookings,
  cancelBooking,
} from "../controllers/bookingsController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, listBookings);

router.post(
  "/",
  authenticate,
  [
    body("fullName").optional().trim().isLength({ min: 2, max: 80 }),
    body("destination").trim().isLength({ min: 2, max: 120 }),
    body("startDate").isISO8601(),
    body("endDate").optional().isISO8601(),
    body("guests").isInt({ min: 1, max: 12 }),
    body("budget").isFloat({ min: 100 }),
    body("notes").optional({ values: "falsy" }).trim().isLength({ max: 600 }),
  ],
  createBooking,
);

router.patch("/:id/cancel", authenticate, cancelBooking);

export default router;
