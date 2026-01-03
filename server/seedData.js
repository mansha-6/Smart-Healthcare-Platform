const mongoose = require('mongoose');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

const bcrypt = require('bcryptjs');
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_healthcare');
        console.log('MongoDB Connected');

        // Clear existing
        await Appointment.deleteMany({});
        await User.deleteMany({ email: { $in: ['doc1@test.com', 'doc2@test.com', 'patient@test.com'] } });
        console.log('Cleared old test data');

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Doctors
        const doc1 = await User.create({
            name: 'Dr. John Doe',
            email: 'doc1@test.com',
            password: hashedPassword,
            role: 'doctor',
            specialization: 'Cardiology',
            experience: 10,
            address: '123 Heart St',
            fees: 100,
            image: '/assets/doctors/dr_male.jpg'
        });

        const doc2 = await User.create({
            name: 'Dr. Jane Smith',
            email: 'doc2@test.com',
            password: hashedPassword,
            role: 'doctor',
            specialization: 'Dermatology',
            experience: 5,
            address: '456 Skin Ave',
            fees: 80,
            image: '/assets/doctors/dr_female.jpg'
        });

        // Create Patient (if you want a fresh one, or just link appointments to existing logged in user if known... 
        // better to just create docs for now and let user rely on their own login, 
        // BUT we need to associate appointments to the CURRENT user. 
        // This script runs offline, so we can't easily know the current user ID unless hardcoded or passed.)
        
        // For now, let's just create generic appointments that are "global" or linked to a demo patient
        // preventing the server error requires VALID doctor IDs in appointments.
        
        console.log('Doctors Created:', doc1._id, doc2._id);
        console.log('Done. Please manually book appointments now that valid doctors exist.');
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
