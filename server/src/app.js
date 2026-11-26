import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isLocalDevOrigin = (origin) => {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    return (
      protocol === "http:" &&
      (hostname === "localhost" || hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
};

// Builds the Express app without connecting to a database or listening on a
// port, so tests can import it. server.js does the connecting and listening.
// Environment variables are read here, at call time, so dotenv must run first.
export const createApp = () => {
  const app = express();
  const allowedOrigins = new Set(
    (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

  app.use(helmet({ crossOriginResourcePolicy: false }));
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }
  app.use(cookieParser());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin) || isLocalDevOrigin(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  app.use("/api", routes);

  app.get("/", (req, res) => {
    res.send("Welcome to the Travel Booking API");
  });

  return app;
};
