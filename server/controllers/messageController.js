const Message = require('../models/Message');
const User = require('../models/User');

// Get all conversations for the current user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all distinct users who have interacted with this user
    // We can aggregate to get the last message per user
    // For simplicity V1: Fetch distinct sender/receivers
    
    // 1. Find all messages involve user
    const messages = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const contactIds = new Set();
    const conversations = [];

    for (const msg of messages) {
        const otherId = msg.sender.toString() === userId ? msg.receiver.toString() : msg.sender.toString();
        
        if (!contactIds.has(otherId)) {
            contactIds.add(otherId);
            
            // We need to fetch User details. 
            // Optimally we'd .populate but since we are manually distinct-ing, let's fetch individual or loop
            // Since this loop runs on messages, it encounters the "last" message first (due to sort)
            
            conversations.push({
                contactId: otherId,
                lastMessage: msg.message,
                time: msg.createdAt,
                unread: !msg.read && msg.receiver.toString() === userId
            });
        }
    }

    // Populate details
    const popConversations = await Promise.all(conversations.map(async (conv) => {
        const user = await User.findById(conv.contactId).select('name role image specialization');
        if (!user) return null; // User deleted?
        return {
            id: user._id,
            name: user.name,
            avatar: user.image,
            role: user.role,
            specialization: user.specialization, // For doctor
            lastMessage: conv.lastMessage,
            time: conv.time,
            unread: conv.unread
        };
    }));

    res.json(popConversations.filter(c => c !== null));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get messages between current user and another user
exports.getMessages = async (req, res) => {
    try {
        const { contactId } = req.params;
        const userId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: contactId },
                { sender: contactId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
