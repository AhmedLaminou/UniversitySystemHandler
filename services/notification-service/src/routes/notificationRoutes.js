const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { body } = require("express-validator");

// Validation middleware
const validateNotification = [
  body("userId").notEmpty().withMessage("userId requis"),
  body("title").notEmpty().withMessage("title requis"),
  body("message").notEmpty().withMessage("message requis")
];

const validateEmail = [
  body("email").isEmail().withMessage("Email invalide")
];

// Send notification (in-app + optional email)
router.post("/send", validateNotification, notificationController.sendNotification);

// Send email only
router.post("/email", validateEmail, notificationController.sendEmailOnly);

// Get user notifications
router.get("/user/:userId", notificationController.getUserNotifications);

// Get user notification stats
router.get("/user/:userId/stats", notificationController.getStats);

// Mark all as read
router.put("/user/:userId/read-all", notificationController.markAllAsRead);

// Mark single notification as read
router.put("/:id/read", notificationController.markAsRead);

// Delete notification
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
