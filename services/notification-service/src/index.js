const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8084;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://mongodb:27017/notification_db")
  .then(() => console.log("📧 Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "notification-service",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Notification Service API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      send: "POST /api/notifications/send",
      email: "POST /api/notifications/email",
      user: "GET /api/notifications/user/:userId",
      markRead: "PUT /api/notifications/:id/read"
    }
  });
});

app.listen(PORT, () => {
  console.log(`📧 Notification Service running on port ${PORT}`);
});
