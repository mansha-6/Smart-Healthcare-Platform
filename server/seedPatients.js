const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const names = [
    "Aarav Patel", "Vihaan Rao", "Aditya Sharma", "Sai Kapoor", "Reyansh Gupta",
    "Arjun Singh", "Vivaan Joshi", "Ayaan Kumar", "Ishaan Verma", "Dhruv Choudhury",
    "Anaya Reddy", "Saanvi Nair", "Kiara Mehta", "Diya Malhotra", "Myra Saxena",
    "Aadhya Iyer", "Pari Das", "Mira Kulkarni", "Riya Jain", "Anvi Bhatt"
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad"];

const seedPatients = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'smartHealthcareDB' });
        console.log('MongoDB Connected for Seeding...');

        // Optional: Clear existing "Temp Verifier" users if desired, but let's keep it safe and just add
        // Aggressive cleanup: Delete all users created by the verification script
        const deleted = await User.deleteMany({ 
            $or: [
                { name: { $regex: 'Temp Verifier', $options: 'i' } },
                { email: { $regex: 'tempverifier', $options: 'i' } }
            ]
        });
        console.log(`Cleaned up ${deleted.deletedCount} temp verifier accounts.`);

        const password = await bcrypt.hash('password123', 10);
        
        const patients = [];
        for (let i = 0; i < 20; i++) {
            const name = names[i];
            const isMale = i < 10;
            
            patients.push({
                name: name,
                email: `patient${i + 1}_${Date.now()}@example.com`,
                password: password,
                role: 'patient',
                age: Math.floor(Math.random() * (65 - 18 + 1)) + 18, // 18 to 65
                gender: isMale ? 'Male' : 'Female',
                phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
                address: `${Math.floor(Math.random() * 100)} ${cities[Math.floor(Math.random() * cities.length)]}, India`,
                medicalHistory: []
            });
        }

        await User.insertMany(patients);
        console.log(`Successfully seeded ${patients.length} diverse patients!`);
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedPatients();
