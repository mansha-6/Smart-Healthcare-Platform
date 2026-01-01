const express = require('express');
const { getConversations, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:contactId', protect, getMessages);

module.exports = router;
