const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Models
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Report = require('../models/Report');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Review = require('../models/Review');
// Departments are usually structural, so we might keep them, or wipe them if requested. 
// "Past records" implies transactional data. I'll leave Departments for now to avoid breaking UI dropdowns.

// Docker internal URL fallback
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/smart_healthcare';

const resetData = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB at:', mongoUri);

        console.log('--- Wiping Data ---');
        
        const deletions = [
            { name: 'Users', model: User },
            { name: 'Appointments', model: Appointment },
            { name: 'Prescriptions', model: Prescription },
            { name: 'Reports', model: Report },
            { name: 'Messages', model: Message },
            { name: 'Notifications', model: Notification },
            { name: 'Reviews', model: Review }
        ];

        for (const { name, model } of deletions) {
            const result = await model.deleteMany({});
            console.log(`Deleted ${result.deletedCount} ${name}.`);
        }

        console.log('--- Database Wiped Successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('Error wiping database:', error);
        process.exit(1);
    }
};

resetData();
