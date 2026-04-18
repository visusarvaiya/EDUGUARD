const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getCoordinatorSummary, getSystemicIssues } = require('../controllers/coordinatorController');

const router = express.Router();

router.get('/summary', authenticate, authorize(['Academic Coordinator']), getCoordinatorSummary);
router.get('/systemic-issues', authenticate, authorize(['Academic Coordinator']), getSystemicIssues);

module.exports = router;
