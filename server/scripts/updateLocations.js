const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' }); // Adjust path as needed locally vs docker

const CITIES = ['New York', 'Los Angeles', 'Chicago', 'London', 'Mumbai', 'Delhi', 'Dubai', 'Toronto', 'Sydney'];

const connectDB = async () => {
    try {
        // Use MONGO_URI from env or default to docker internal one if running in container
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

const randomizeDoctors = async () => {
    await connectDB();

    try {
        const doctors = await User.find({ role: 'doctor' });
        console.log(`Found ${doctors.length} doctors to update.`);

        for (const doc of doctors) {
            const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
            // Randomize availability slightly for realism if needed, though schema might just have isAvailable boolean
            // We'll update the address field.
            
            doc.address = `${randomCity}`; // Just city or "Clinic, City"
            await doc.save();
            console.log(`Updated ${doc.name} -> ${doc.address}`);
        }

        console.log('All doctors updated successfully.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

randomizeDoctors();
