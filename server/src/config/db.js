import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const connectInMemoryDb = async () => {
  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri(), {
    dbName: "travel",
  });
  console.warn(
    "MongoDB memory server connected (in-memory). Data will NOT persist across restarts.",
  );
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const allowInMemoryDb = process.env.ALLOW_IN_MEMORY_DB === "true";

  // Try connecting to the configured MongoDB URI first.
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      // Log the host only: the full URI contains the database password.
      console.log("MongoDB connected:", mongoose.connection.host);
      return;
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      if (allowInMemoryDb) {
        await connectInMemoryDb();
        return;
      }
      throw new Error(
        "MONGODB_URI is set but MongoDB is not reachable. Start MongoDB, fix MONGODB_URI, or set ALLOW_IN_MEMORY_DB=true for local development.",
      );
    }
  }

  // Fall back to in-memory server only when no persistent DB is configured.
  if (allowInMemoryDb) {
    try {
      await connectInMemoryDb();
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
