const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getUnreadAlerts, markAlertAsRead, markAllAlertsAsRead } = require('../controllers/alertController');

const router = express.Router();

router.get('/unread', authenticate, getUnreadAlerts);
router.patch('/:alertId/read', authenticate, markAlertAsRead);
router.patch('/read-all', authenticate, markAllAlertsAsRead);

module.exports = router;
