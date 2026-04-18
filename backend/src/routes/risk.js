const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getStudentRisk, getRiskHistory, simulateStudentRisk } = require('../controllers/riskController');

const router = express.Router();

router.get('/students/:studentId/risk', authenticate, getStudentRisk);
router.get('/students/:studentId/history', authenticate, getRiskHistory);
router.post('/simulate', authenticate, authorize(['Student']), simulateStudentRisk);

module.exports = router;
