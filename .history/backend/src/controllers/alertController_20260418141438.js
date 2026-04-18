const Alert = require('../models/Alert');

const getUnreadAlerts = async (req, res) => {
  try {
    const { userId } = req.user;

    const alerts = await Alert.find({ mentorId: userId, isRead: false })
      .populate('studentId', 'userId')
      .populate('linkedStudentId', 'userId')
      .sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAlertAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findByIdAndUpdate(alertId, { isRead: true }, { new: true });

    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAllAlertsAsRead = async (req, res) => {
  try {
    const { userId } = req.user;

    await Alert.updateMany({ mentorId: userId, isRead: false }, { isRead: true });

    res.status(200).json({ message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUnreadAlerts, markAlertAsRead, markAllAlertsAsRead };
