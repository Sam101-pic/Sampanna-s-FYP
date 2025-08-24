// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { connectDB } from "./config/db.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import routes from "./routes/index.js";

const app = express();

/* -------------------- Middleware -------------------- */
app.use(helmet());
app.use(compression());
app.use(json());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* -------------------- Rate limiter -------------------- */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "⚠️ Too many requests, try again later.",
  })
);

/* -------------------- CORS -------------------- */
const allowedOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

console.log("🌍 Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error(`❌ CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

/* -------------------- Health check -------------------- */
app.get("/", (_req, res) => {
  res.json({ message: "🧠 SwasthaMann Backend API running" });
});

/* -------------------- Routes -------------------- */
routes(app);

/* -------------------- Error middleware -------------------- */
app.use(errorMiddleware);

/* -------------------- HTTP + Socket.IO -------------------- */
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    credentials: true,
  },
});

// attach io to express for controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ Connected:", socket.id);

  // join user room (by userId)
  socket.on("join", (userId) => {
    if (userId) {
      socket.join(String(userId));
      console.log(`👤 User ${userId} joined`);
      io.emit("user-online", { userId });
    }
  });

  // message events
  socket.on("send-message", (msg) => {
    console.log("💬 Message:", msg);
    // send to all participants of that thread
    io.to(msg.threadId).emit("new-message", msg);
  });

  // typing indicator
  socket.on("typing", ({ threadId, userId }) => {
    io.to(threadId).emit("typing", { userId });
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

/* -------------------- Start -------------------- */
(async () => {
  try {
    await connectDB();
    let PORT = parseInt(process.env.PORT, 10) || 5000;

    const startServer = (port) =>
      new Promise((resolve, reject) => {
        httpServer
          .listen(port, () => {
            console.log(`✅ Server running on http://localhost:${port}`);
            resolve();
          })
          .on("error", (err) => {
            if (err.code === "EADDRINUSE") {
              console.warn(`⚠️ Port ${port} busy → trying ${port + 1}`);
              resolve(startServer(port + 1));
            } else reject(err);
          });
      });

    await startServer(PORT);
  } catch (err) {
    console.error("🔥 Startup failed:", err?.message || err);
    process.exit(1);
  }
})();

export { app, io };
