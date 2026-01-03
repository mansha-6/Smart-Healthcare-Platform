const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const User = require('./models/User');
require('dotenv').config();

const seed = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');

        // Find a doctor and a patient
        const doctor = await User.findOne({ role: 'doctor' });
        const patient = await User.findOne({ role: 'patient' });

        if (!doctor || !patient) {
            console.log('Error: Doctor or Patient not found. Seed users first.');
            process.exit(1);
        }

        console.log(`Doctor: ${doctor.name}, Patient: ${patient.name}`);

        const apps = [
            {
                patientId: patient._id,
                doctorId: doctor._id.toString(), // Schema says String, but can be ID
                doctorName: doctor.name,
                date: new Date('2024-05-10'),
                time: '10:00 AM',
                type: 'physical',
                fees: doctor.fees || 50,
                status: 'completed',
                reason: 'Regular Checkup'
            },
            {
                patientId: patient._id,
                doctorId: doctor._id.toString(),
                doctorName: doctor.name,
                date: new Date('2024-04-15'),
                time: '02:00 PM',
                type: 'online',
                fees: doctor.fees || 50,
                status: 'completed',
                reason: 'Follow up'
            },
            {
                patientId: patient._id,
                doctorId: doctor._id.toString(),
                doctorName: doctor.name,
                date: new Date('2024-03-01'),
                time: '11:30 AM',
                type: 'physical',
                fees: doctor.fees || 50,
                status: 'cancelled',
                reason: 'Personal Emergency'
            }
        ];

        await Appointment.insertMany(apps);
        console.log(`Seeded ${apps.length} appointments.`);
        
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
seed();
