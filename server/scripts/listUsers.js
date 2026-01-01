const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: '../.env' }); // Adjust path if needed

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/smart_healthcare');
        console.log('MongoDB Connected');
        
        const users = await User.find({}, 'name role email');
        console.log('\n--- REGISTERED USERS ---');
        users.forEach(u => {
            console.log(`Name: '${u.name}' | Role: ${u.role} | ID: ${u._id}`);
        });
        console.log('--- END ---\n');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
