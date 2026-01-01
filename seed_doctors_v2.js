const mongoose = require('mongoose');
const User = require('./server/models/User'); 
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Explicitly load env from correct path
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_healthcare';

const seedDoctors = async () => {
    try {
        console.log('Connecting to:', mongoUri);
        await mongoose.connect(mongoUri);
        console.log("DB Connected successfully");

        const count = await User.countDocuments({ role: 'doctor' });
        console.log(`Current Doctors count: ${count}`);

        if (count < 3) {
            console.log("Seeding new doctors...");
            const hashedPassword = await bcrypt.hash('123456', 10);
            
            const docs = [
                {
                    name: 'Dr. Emily Stones',
                    email: 'emily@example.com',
                    password: hashedPassword,
                    role: 'doctor',
                    specialization: 'Pediatrician',
                    fees: 60,
                    experience: 5,
                    isAvailable: true
                },
                {
                    name: 'Dr. John Watson',
                    email: 'john@example.com',
                    password: hashedPassword,
                    role: 'doctor',
                    specialization: 'Cardiologist',
                    fees: 100,
                    experience: 12,
                    isAvailable: true
                }
            ];

            for (const d of docs) {
                const exists = await User.findOne({ email: d.email });
                if (!exists) {
                    await User.create(d);
                    console.log(`Created ${d.name}`);
                } else {
                    console.log(`${d.name} already exists`);
                }
            }
            console.log("Seeding complete.");
        } else {
             console.log("Enough doctors exist already.");
        }
        
        // List all doctors to confirm
        const allDocs = await User.find({ role: 'doctor' }).select('name email');
        console.log('Final Doctor List:', allDocs);

        process.exit(0);
    } catch (e) {
        console.error("SEED ERROR:", e);
        process.exit(1);
    }
};

seedDoctors();
