const mongoose = require('mongoose');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const doctors = [
    {
        name: "Dr. Eion Morgan",
        email: "eion@example.com",
        password: "password123",
        role: "doctor",
        specialization: "Pediatrician",
        experience: 15,
        fees: 50.99,
        gender: "Male",
        address: "City Hospital, NY",
        bio: "Eion Morgan is a dedicated pediatrician with over 15 years of experience in caring for children's health. She is passionate about ensuring the well-being of your little ones and believes in a holistic approach.",
        schedule: {
            days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            timeSlots: {
                Morning: ["09:00 AM", "10:00 AM", "11:00 AM"],
                Afternoon: ["02:00 PM", "03:00 PM", "04:00 PM"],
                Evening: ["06:00 PM", "07:00 PM"]
            }
        }
    },
    {
        name: "Dr. Andrea H.",
        email: "andrea@example.com",
        password: "password123",
        role: "doctor",
        specialization: "Endocrinologist",
        experience: 12,
        fees: 75.00,
        gender: "Female",
        address: "Health Plus Clinic",
        bio: "Dr. Andrea H. specializes in endocrinology with a focus on diabetes management and thyroid disorders. She is committed to providing personalized care plans for her patients.",
        schedule: {
            days: ["Mon", "Wed", "Fri"],
            timeSlots: {
                Morning: ["08:00 AM", "09:00 AM"],
                Afternoon: ["01:00 PM", "02:00 PM"],
                Evening: []
            }
        }
    },
    {
        name: "Dr. Stefan Persson",
        email: "stefan@example.com",
        password: "password123",
        role: "doctor",
        specialization: "Cardiologist",
        experience: 20,
        fees: 120.00,
        gender: "Male",
        address: "Heart Center, Boston",
        bio: "Dr. Stefan Persson is a renowned cardiologist known for his expertise in interventional cardiology. He has performed over 500 successful surgeries.",
        schedule: {
            days: ["Tue", "Thu", "Sat"],
            timeSlots: {
                Morning: ["10:00 AM", "11:00 AM"],
                Afternoon: ["03:00 PM", "04:00 PM"],
                Evening: ["08:00 PM"]
            }
        }
    }
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_healthcare');
        console.log('MongoDB Connected');

        // Optional: Clear existing doctors (use with caution in prod, safe for dev)
        // await User.deleteMany({ role: 'doctor' });

        for (const doc of doctors) {
            const existing = await User.findOne({ email: doc.email });
            if (existing) {
                // Update existing
                existing.bio = doc.bio;
                existing.schedule = doc.schedule;
                existing.specialization = doc.specialization; // ensure spec matches
                await existing.save();
                console.log(`Updated ${doc.name}`);
            } else {
                // Create new
                const hashedPassword = await bcrypt.hash(doc.password, 10);
                await User.create({ ...doc, password: hashedPassword });
                console.log(`Created ${doc.name}`);
            }
        }

        console.log('Doctors seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding doctors:', error);
        process.exit(1);
    }
};

seedDoctors();
