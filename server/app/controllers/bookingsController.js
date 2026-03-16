import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Booking from "../models/Booking.js";

const ensureDatabaseConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: "Database is not connected. Booking was not saved.",
    });
    return false;
  }
  return true;
};

export const createBooking = async (req, res) => {
  if (!ensureDatabaseConnected(res)) return;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Please correct the highlighted booking details.",
      errors: errors.array(),
    });
  }

  try {
    const { destination, startDate, endDate, guests, budget, notes, fullName } =
      req.body;

    const bookingData = {
      destination,
      startDate,
      endDate,
      guests,
      budget,
      notes,
      user: req.user._id,
      email: req.user.email,
      fullName: fullName || req.user.name,
    };

    const booking = await Booking.create(bookingData);

    return res.status(201).json({
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to save the booking right now.",
    });
  }
};

export const listBookings = async (req, res) => {
  if (!ensureDatabaseConnected(res)) return;

  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ bookings });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load bookings right now.",
    });
  }
};

export const cancelBooking = async (req, res) => {
  if (!ensureDatabaseConnected(res)) return;

  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled." });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.json({ message: "Booking cancelled.", booking });
  } catch (error) {
    return res.status(500).json({ message: "Unable to cancel booking." });
  }
};
