import mongoose from "mongoose";
import { validationResult } from "express-validator";
import destinations from "../data/destinations.js";
import Destination from "../models/Destination.js";

export const listDestinations = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const { category, featured, search } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }
    if (featured === "true") {
      filter.featured = true;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    const destinations = await Destination.find(filter).sort({
      createdAt: -1,
    });

    return res.json({ destinations });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load destinations." });
  }
};

export const getDestination = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    return res.json({ destination });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load destination." });
  }
};

export const createDestination = async (req, res) => {
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
    const { name, country, description, image, price, rating, category, featured } =
      req.body;

    const destination = await Destination.create({
      name,
      country,
      description,
      image,
      price,
      rating,
      category,
      featured: featured || false,
    });

    return res.status(201).json({
      message: "Destination created successfully.",
      destination,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create destination." });
  }
};

export const updateDestination = async (req, res) => {
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
    const allowed = [
      "name",
      "country",
      "description",
      "image",
      "price",
      "rating",
      "category",
      "featured",
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    );

    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    return res.json({
      message: "Destination updated successfully.",
      destination,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update destination." });
  }
};

export const deleteDestination = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    return res.json({ message: "Destination deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete destination." });
  }
};

export const seedDestinations = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const count = await Destination.countDocuments();
    if (count > 0) {
      return res.json({ message: "Destinations already seeded.", count });
    }


    await Destination.insertMany(destinations);

    return res.status(201).json({
      message: "Destinations seeded successfully.",
      count: destinations.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to seed destinations." });
  }
};
