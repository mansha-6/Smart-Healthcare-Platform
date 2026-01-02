const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Hardcoded URI for Docker Service
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/smart_healthcare';

const seedUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB in Docker');

        await User.deleteMany({});
        console.log('Cleared existing users');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            {
                name: "Admin User",
                email: "admin@admin.com",
                password: hashedPassword,
                role: "admin"
            },
            {
                name: "Dr. Smith",
                email: "doctor@hospital.com",
                password: hashedPassword,
                role: "doctor",
                specialization: "Cardiologist",
                fees: 100,
                experience: 15
            },
            {
                name: "John Doe",
                email: "patient@test.com",
                password: hashedPassword,
                role: "patient"
            }
        ];

        await User.insertMany(users);
        console.log('Seed Success');
        
        process.exit(0);
    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

seedUsers();
