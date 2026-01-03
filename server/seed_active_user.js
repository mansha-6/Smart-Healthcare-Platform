const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const User = require('./models/User');
require('dotenv').config();

const seedForUser = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');

        const activeUserId = '6957b4c20f2b102023d31497'; // ID from logs
        const doctor = await User.findOne({ role: 'doctor' });

        if (!doctor) {
            console.log('Error: Doctor not found.');
            process.exit(1);
        }

        console.log(`Seeding for Patient ID: ${activeUserId} with Doctor: ${doctor.name}`);

        const apps = [
            {
                patientId: activeUserId,
                doctorId: doctor._id.toString(),
                doctorName: doctor.name,
                date: new Date('2024-05-10'),
                time: '10:00 AM',
                type: 'physical',
                fees: doctor.fees || 50,
                status: 'completed',
                reason: 'Regular Checkup (Seeded for YOU)'
            },
            {
                patientId: activeUserId,
                doctorId: doctor._id.toString(),
                doctorName: doctor.name,
                date: new Date('2024-04-15'),
                time: '02:00 PM',
                type: 'online',
                fees: doctor.fees || 50,
                status: 'completed',
                reason: 'Follow up (Seeded for YOU)'
            }
        ];

        await Appointment.insertMany(apps);
        console.log(`Successfully seeded ${apps.length} appointments for your specific user ID.`);
        
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
seedForUser();
