const express = require('express');
const { getUserHistory, deleteHistoryItem, clearUserHistory, updateProfile } = require('../controllers/userController.js');

const router = express.Router();
router.get('/history/:userId', getUserHistory);
router.delete('/history/:userId/:id', deleteHistoryItem);
router.post('/history/:userId/clear', clearUserHistory);
router.put('/profile/:id', updateProfile);
module.exports =router;