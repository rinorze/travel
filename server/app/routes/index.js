import { Router } from "express";
import bookingsRouter from "./bookings.js";
import authRouter from "./auth.js";
import destinationsRouter from "./destinations.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/bookings", bookingsRouter);
router.use("/destinations", destinationsRouter);

export default router;
