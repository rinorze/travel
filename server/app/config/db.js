import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const allowInMemoryDb = process.env.ALLOW_IN_MEMORY_DB === "true";

  // Try connecting to the configured MongoDB URI first
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB connected:", mongoUri);
      return;
    } catch (error) {
      console.warn("MongoDB connection failed:", error.message);
    }
  }

  // Fall back to in-memory server if allowed
  if (allowInMemoryDb) {
    try {
      memoryServer = await MongoMemoryServer.create();
      await mongoose.connect(memoryServer.getUri(), {
        dbName: "travel",
      });
      console.log("MongoDB memory server connected (in-memory fallback)");
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
