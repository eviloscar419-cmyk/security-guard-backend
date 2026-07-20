const express = require('express');

const {
  sendMessage,
  getMessages,
  getAdminConversations,
  markRead
} = require('../controllers/chatController.js');

const router = express.Router();


router.post('/send', sendMessage);


// Admin route MUST come before /:user1/:user2
router.get('/admin/:adminId', getAdminConversations);


router.get('/:user1/:user2', getMessages);


router.put('/mark-read/:receiverId/:senderId', markRead);


module.exports = router;
