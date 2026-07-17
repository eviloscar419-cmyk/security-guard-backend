const express = require('express');
const { analyzePassword, scanUrl, getStats } = require('../controllers/toolsController.js');

const router = express.Router();
router.post('/password-analyze', analyzePassword);
router.post('/phishing-scan', scanUrl);
router.get('/stats', getStats);

module.exports =router;