const Notification = require('../models/Notification');

const sendNotification = async ({ userId, message, type = 'info', email, phone }) => {
    try {
        // 1. Save to In-App Database
        await Notification.create({
            userId,
            message,
            isRead: false,
            // type can be stored if model supports it, but message is key
            createdAt: new Date()
        });

        // 2. Simulate Email Sending
        if (email) {
            console.log(`[MOCK EMAIL SERVICE] Sending email to ${email}: ${message}`);
            // In real app: await transort.sendMail(...)
        }

        // 3. Simulate SMS Sending
        if (phone) {
            console.log(`[MOCK SMS SERVICE] Sending SMS to ${phone}: ${message}`);
            // In real app: await twilioClient.messages.create(...)
        }

    } catch (error) {
        console.error('Notification Service Error:', error);
    }
};

module.exports = sendNotification;
