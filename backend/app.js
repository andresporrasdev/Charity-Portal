const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const otpRouter = require("./routes/otp");
const eventRouter = require("./routes/event");
const volunteerRouter = require("./routes/volunteer");
const roleRouter = require("./routes/role");
const volunteerRolesRouter = require("./routes/volunteerRoleRouter");
const postRouter = require("./routes/postRouter");
const contactRouter = require("./routes/contactRouter");

let app = express();

// Security headers
app.use(helmet());

// CORS — restrict to allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsing — JSON capped at 1 MB; file uploads go through multer
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
app.use(express.json({ limit: "1mb" }));

app.use(express.static("./public"));

// Rate limiters — disabled in test environment to prevent flaky tests
const isTest = process.env.NODE_ENV === "test";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many requests. Please try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isTest ? 10000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many contact requests. Please try again later." },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many requests. Please try again later." },
});

// Apply general limiter globally
app.use(generalLimiter);

// Health check (used by Render + CI)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/otp", authLimiter, otpRouter);
app.use("/api/contact", contactLimiter, contactRouter);
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/volunteer", volunteerRouter);
app.use("/api/role", roleRouter);
app.use("/api/volunteerRole", volunteerRolesRouter);
app.use("/api/post", postRouter);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ status: "error", message });
});

module.exports = app;
