const express = require('express');
const { authenticate } = require('../middleware/auth');
const { logIntervention, getInterventions } = require('../controllers/interventionController');

const router = express.Router();

router.post('/', authenticate, logIntervention);
router.get('/:studentId', authenticate, getInterventions);

module.exports = router;
