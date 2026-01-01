const { getUserNotifications, markAsRead } = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
  try {
    const notes = await getUserNotifications(req.user.id);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.markRead = async (req, res) => {
  try {
    await markAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
