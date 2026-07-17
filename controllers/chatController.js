const Message = require('../models/Message.js');

const sendMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    res.json(await Message.find({
      $or: [
        { senderId: req.params.user1, receiverId: req.params.user2 },
        { senderId: req.params.user2, receiverId: req.params.user1 }
      ]
    }).sort({ createdAt: 1 }));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAdminConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.adminId },
        { receiverId: req.params.adminId }
      ]
    }).sort({ createdAt: -1 });

    const conversations = {};
    messages.forEach(msg => {
      const otherUserId = msg.senderId === req.params.adminId ? msg.receiverId : msg.senderId;
      const otherUserName = msg.senderId === req.params.adminId ? msg.receiverName : msg.senderName;
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unread: msg.receiverId === req.params.adminId && !msg.read
        };
      }
    });
    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const markRead = async (req, res) => {
  try {
    await Message.updateMany({ senderId: req.params.senderId, receiverId: req.params.receiverId, read: false }, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getAdminConversations,
  markRead,
}