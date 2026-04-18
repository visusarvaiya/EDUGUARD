const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { generatePDFReport, generateCSVExport } = require('../controllers/reportController');

const router = express.Router();

router.get('/pdf/:studentId', authenticate, generatePDFReport);
router.get('/csv', authenticate, authorize(['Academic Coordinator']), generateCSVExport);

module.exports = router;
