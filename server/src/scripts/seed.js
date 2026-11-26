// Insert the starter destinations if the collection is empty.
//
//   npm run seed
//
// The home page used to call the public seed route on every visitor's first
// load. Seeding is a write, so it now happens from the server (here) or
// through the admin-only POST /api/destinations/seed.
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import destinations from "../data/destinations.js";
import Destination from "../models/Destination.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const existing = await Destination.countDocuments();
if (existing > 0) {
  console.log(`Already seeded (${existing} destinations). Nothing to do.`);
} else {
  await Destination.insertMany(destinations);
  console.log(`Inserted ${destinations.length} destinations.`);
}
await mongoose.disconnect();
