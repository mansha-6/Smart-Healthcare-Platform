const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Send a notification to a user.
 * Saves to DB and simulates SMS/Email.
 * 
 * @param {string} userId - ID of recipient
 * @param {string} message - Notification text
 * @param {string} type - 'info', 'success', 'warning', 'error'
 */
exports.sendNotification = async (userId, message, type = 'info') => {
  try {
    // 1. Save to Database (So user sees it in app)
    const notification = new Notification({
      userId,
      message,
      type
    });
    await notification.save();

    // 2. Simulate External Send (Email/SMS)
    const user = await User.findById(userId);
    if (user) {
        console.log(`\n[MOCK EXTERNAL NOTIFICATION]`);
        console.log(`To: ${user.name} (${user.email} / ${user.phone})`);
        console.log(`Message: ${message}`);
        console.log(`----------------------------\n`);
    }

    return notification;
  } catch (error) {
    console.error('Notification Service Error:', error);
  }
};

/**
 * Get all notifications for a user
 */
exports.getUserNotifications = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (notificationId) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};
