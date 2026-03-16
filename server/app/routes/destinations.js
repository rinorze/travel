import { Router } from "express";
import {
  listDestinations,
  getDestination,
  seedDestinations,
} from "../controllers/destinationsController.js";

const router = Router();

router.get("/", listDestinations);
router.post("/seed", seedDestinations);
router.get("/:id", getDestination);

export default router;
