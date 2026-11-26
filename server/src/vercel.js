// Vercel serverless handler: the whole Express API runs as one function (api/index.js).
// Locally, server/src/server.js is used instead (it listens on a port).
import mongoose from "mongoose";
import { createApp } from "./app.js";

const app = createApp();

// Reuse one connection across warm invocations instead of reconnecting per request.
let connecting;
const connect = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      .catch((error) => {
        connecting = undefined;
        throw error;
      });
  }
  return connecting;
};

export default async function handler(req, res) {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    res.status(500).json({ message: "Server is missing MONGODB_URI or JWT_SECRET." });
    return;
  }
  try {
    await connect();
  } catch {
    // The routes answer 503 themselves when the database is not connected.
  }
  return app(req, res);
}
