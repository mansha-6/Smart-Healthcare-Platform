const mongoose = require('mongoose');
const User = require('./server/models/User'); // Adjust path
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: './server/.env' });

const mongoUri = 'mongodb://127.0.0.1:27017/smart_healthcare';

const seedDoctors = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("DB Connected");

        const count = await User.countDocuments({ role: 'doctor' });
        console.log(`Current Doctors: ${count}`);

        if (count < 3) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            
            const docs = [
                {
                    name: 'Dr. Emily Stones',
                    email: 'emily@example.com',
                    password: hashedPassword,
                    role: 'doctor',
                    specialization: 'Pediatrician',
                    fees: 60,
                    experience: 5
                },
                {
                    name: 'Dr. John Watson',
                    email: 'john@example.com',
                    password: hashedPassword,
                    role: 'doctor',
                    specialization: 'Cardiologist',
                    fees: 100,
                    experience: 12
                }
            ];

            for (const d of docs) {
                const exists = await User.findOne({ email: d.email });
                if (!exists) {
                    await User.create(d);
                    console.log(`Created ${d.name}`);
                }
            }
        } else {
             console.log("Enough doctors exist.");
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedDoctors();
