const socketIo = require('socket.io');

const setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.emit("me", socket.id);

    // Join a room based on User ID to allow private messaging
    socket.on("join_room", (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        }
    });

    // Send Message Event
    socket.on("send_message", async (data) => {
        // data = { to: receiverId, message, senderId, senderName ... }
        console.log(`Message from ${data.senderId} to ${data.to}: ${data.message}`);
        
        // Save to DB
        try {
            const Message = require('../models/Message');
            const newMessage = new Message({
                sender: data.senderId,
                receiver: data.to,
                senderName: data.senderName, // Ensure client sends this
                message: data.message,
                read: false
            });
            await newMessage.save();
            
            // Enrich data with timestamp from DB
            const emitData = { ...data, time: newMessage.createdAt };
            
            io.to(data.to).emit("receive_message", emitData);
        } catch (err) {
            console.error('Socket Message Save Error:', err);
            // Still emit even if save fails? Better to fail gracefully or retry.
            // For now, emit original data to keep realtime working
             io.to(data.to).emit("receive_message", data);
        }
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
    });

    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });
  });

  return io;
};

module.exports = setupSocket;
