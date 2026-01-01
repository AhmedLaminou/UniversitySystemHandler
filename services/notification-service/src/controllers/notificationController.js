const Notification = require("../models/Notification");
const { sendEmail, sendCustomEmail } = require("../services/emailService");

/**
 * Send a notification (in-app and optionally email)
 */
exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, category, title, message, data, sendEmail: shouldSendEmail, email, emailTemplate } = req.body;

    // Create in-app notification
    const notification = new Notification({
      userId,
      type: type || "in_app",
      category: category || "system",
      title,
      message,
      data,
      priority: req.body.priority || "normal"
    });

    await notification.save();

    // Send email if requested
    if (shouldSendEmail && email) {
      let emailResult;
      
      if (emailTemplate && data) {
        emailResult = await sendEmail(email, emailTemplate, data);
      } else {
        emailResult = await sendCustomEmail(email, title, `<p>${message}</p>`);
      }

      if (emailResult.success) {
        notification.emailSent = true;
        notification.emailSentAt = new Date();
        await notification.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Notification envoyée",
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Send email only (without creating in-app notification)
 */
exports.sendEmailOnly = async (req, res) => {
  try {
    const { email, template, data, subject, htmlContent } = req.body;

    let result;
    if (template) {
      result = await sendEmail(email, template, data);
    } else if (subject && htmlContent) {
      result = await sendCustomEmail(email, subject, htmlContent);
    } else {
      return res.status(400).json({
        success: false,
        message: "Fournir un template ou subject+htmlContent"
      });
    }

    res.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get notifications for a user
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { userId };
    if (unreadOnly === "true") {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification non trouvée"
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Mark all notifications as read for a user
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marquées comme lues`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete a notification
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification non trouvée"
      });
    }

    res.json({
      success: true,
      message: "Notification supprimée"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get notification statistics
 */
exports.getStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Notification.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } },
          byCategory: { $push: "$category" }
        }
      }
    ]);

    const categoryCount = {};
    if (stats[0]?.byCategory) {
      stats[0].byCategory.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    }

    res.json({
      success: true,
      data: {
        total: stats[0]?.total || 0,
        unread: stats[0]?.unread || 0,
        byCategory: categoryCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
