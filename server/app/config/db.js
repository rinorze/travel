import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const allowInMemoryDb = process.env.ALLOW_IN_MEMORY_DB === "true";

  // Try connecting to the configured MongoDB URI first.
  // Important: if a URI is configured but the connection fails, do NOT silently
  // fall back to an in-memory DB (that would make it look like data is saved,
  // but it disappears on restart and won't show up in the expected database).
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB connected:", mongoUri);
      return;
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      throw new Error(
        "MONGODB_URI is set but MongoDB is not reachable. Start MongoDB or fix MONGODB_URI.",
      );
    }
  }

  // Fall back to in-memory server only when no persistent DB is configured.
  if (allowInMemoryDb) {
    try {
      memoryServer = await MongoMemoryServer.create();
      await mongoose.connect(memoryServer.getUri(), {
        dbName: "travel",
      });
      console.warn(
        "MongoDB memory server connected (in-memory). Data will NOT persist across restarts.",
      );
      return;
    } catch (error) {
      console.error("MongoDB fallback connection failed:", error.message);
    }
  }

  // If we reach here, no database is available
  throw new Error(
    "Could not connect to any database. Ensure MongoDB is running or set ALLOW_IN_MEMORY_DB=true in .env",
  );
};

export default connectDB;
