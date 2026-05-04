import { Router } from "express";
import { body } from "express-validator";
import {
  listDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  seedDestinations,
} from "../controllers/destinationsController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", listDestinations);
router.post("/seed", seedDestinations);
router.get("/:id", getDestination);

// Admin-only routes
const destinationValidation = [
  body("name").trim().isLength({ min: 2, max: 120 }),
  body("country").trim().isLength({ min: 2, max: 80 }),
  body("description").trim().isLength({ min: 10, max: 1000 }),
  body("image").trim().isURL(),
  body("price").isFloat({ min: 0 }),
  body("rating").isFloat({ min: 0, max: 5 }),
  body("category").isIn(["beach", "mountain", "city", "cultural", "adventure"]),
  body("featured").optional().isBoolean(),
];

router.post("/", authenticate, requireAdmin, destinationValidation, createDestination);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  [
    body("name").optional().trim().isLength({ min: 2, max: 120 }),
    body("country").optional().trim().isLength({ min: 2, max: 80 }),
    body("description").optional().trim().isLength({ min: 10, max: 1000 }),
    body("image").optional().trim().isURL(),
    body("price").optional().isFloat({ min: 0 }),
    body("rating").optional().isFloat({ min: 0, max: 5 }),
    body("category")
      .optional()
      .isIn(["beach", "mountain", "city", "cultural", "adventure"]),
    body("featured").optional().isBoolean(),
  ],
  updateDestination,
);

router.delete("/:id", authenticate, requireAdmin, deleteDestination);

export default router;
