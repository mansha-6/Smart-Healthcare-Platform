const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription'); // If we want to link prescriptions
require('dotenv').config({ path: '../.env' });

const connectDB = async () => {
    try {
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

const seedHistory = async () => {
    await connectDB();

    try {
        const patients = await User.find({ role: 'patient' });
        const doctors = await User.find({ role: 'doctor' });

        if (patients.length === 0 || doctors.length === 0) {
            console.log('No patients or doctors found. Run seedDockerUsers.js first.');
            process.exit(1);
        }

        console.log(`Found ${patients.length} patients and ${doctors.length} doctors.`);

        for (const patient of patients) {
            console.log(`Creating history for ${patient.name}...`);
            
            // Create 3 past appointments
            const pastDates = [
                new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)  // 30 days ago
            ];

            for (let i = 0; i < pastDates.length; i++) {
                const doctor = doctors[Math.floor(Math.random() * doctors.length)];
                const status = i === 1 ? 'cancelled' : 'completed'; // Make one cancelled
                
                const appt = new Appointment({
                    patientId: patient._id,
                    doctorId: doctor._id, // Use ID ref
                    doctorName: doctor.name, // Fallback if schema uses name
                    date: pastDates[i],
                    time: "10:00 AM",
                    type: i === 0 ? "Video Consultation" : "Clinic Visit",
                    status: status,
                    fees: 50,
                    reason: "Regular checkup"
                });

                await appt.save();

                // If completed (appointment 0 and 2), add a dummy prescription link?
                // The current schema might not rely on explicit link in DB, but let's check.
                // PatientAppointments.jsx checks `apt.hasPrescription`. 
                // We typically need to flag this on the appointment OR the frontend checks if a prescription exists.
                // For now, let's assume we can manually set a flag if schema allows or just rely on backend/frontend matching.
                // Looking at Appointment schema (viewed previously), it didn't have `hasPrescription`.
                // But we can create a Prescription object so the "Latest Prescription" widget picks it up.
                
                if (status === 'completed') {
                    const presc = new Prescription({
                        doctorId: doctor._id,
                        patientId: patient._id,
                        patientName: patient.name,
                        date: pastDates[i],
                        medicines: [
                            { name: "Paracetamol", dosage: "500mg", frequency: "Twice daily" },
                            { name: "Vitamin C", dosage: "1000mg", frequency: "Once daily" }
                        ],
                        notes: "Drink plenty of water."
                    });
                    await presc.save();
                }
            }
        }

        console.log('History seeded successfully.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedHistory();
