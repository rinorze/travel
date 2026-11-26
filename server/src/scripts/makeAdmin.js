// Give an existing account the admin role.
//
//   npm run make-admin -- someone@example.com
//
// Admin rights used to be granted to whoever registered with one hard-coded
// email address. With no email verification, anyone could register with that
// address first and take over the admin panel. Now only someone who can run
// commands on the server, with the database URL, can create an admin.
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const email = process.argv[2]?.toLowerCase().trim();
if (!email) {
  console.error("Usage: npm run make-admin -- <email>");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
await mongoose.disconnect();

if (!user) {
  console.error(`No account with email ${email}. Register it first.`);
  process.exit(1);
}
console.log(`${user.email} is now an admin.`);
