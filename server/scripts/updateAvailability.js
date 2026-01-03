const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/smart_healthcare', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const randomizeAvailability = async () => {
    await connectDB();

    try {
        const doctors = await User.find({ role: 'doctor' });
        console.log(`Found ${doctors.length} doctors.`);

        for (const doc of doctors) {
            // 30% chance to be unavailable
            const isAvailable = Math.random() > 0.3; 
            doc.isAvailable = isAvailable;
            await doc.save();
            console.log(`Updated ${doc.name} -> Available: ${isAvailable}`);
        }

        console.log('Availability randomized.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

randomizeAvailability();
