const mongoose = require('mongoose');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const dotenv = require('dotenv');

dotenv.config();

const seedAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'smartHealthcareDB' });
        console.log('MongoDB Connected for Appointment Seeding...');

        // 1. Get Doctors and Patients
        const doctors = await User.find({ role: 'doctor' });
        const patients = await User.find({ role: 'patient' });

        if (doctors.length === 0) {
            console.log('No doctors found. Please create doctor accounts first.');
            process.exit(1);
        }
        if (patients.length === 0) {
            console.log('No patients found. Please seed patients first.');
            process.exit(1);
        }

        console.log(`Found ${doctors.length} Doctors and ${patients.length} Patients.`);

        const appointments = [];
        const statuses = ['completed', 'confirmed', 'pending'];
        const types = ['online', 'physical'];

        // 2. Generate Assignments
        // Each patient visits 1-3 random doctors
        for (const patient of patients) {
            const numDoctors = Math.floor(Math.random() * 3) + 1; // 1 to 3
            // Shuffle doctors to pick random ones
            const shuffledDoctors = doctors.sort(() => 0.5 - Math.random()).slice(0, numDoctors);

            for (const doctor of shuffledDoctors) {
                // Create 1-2 appointments per doctor pair
                 const numVisits = Math.floor(Math.random() * 2) + 1; 
                 
                 for(let k=0; k<numVisits; k++) {
                    appointments.push({
                        patientId: patient._id,
                        doctorId: doctor._id.toString(), // Match schema String type
                        date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)), // Past or future date randomly
                        time: '10:00 AM',
                        type: types[Math.floor(Math.random() * types.length)],
                        fees: doctor.fees || 500,
                        status: statuses[Math.floor(Math.random() * statuses.length)],
                        reason: 'Routine Checkup or Consultation'
                    });
                 }
            }
        }

        // 3. Clear old appointments (optional, maybe safe to keep adding?)
        // Let's keep adding to build history, unless it's huge. 
        // Actually, let's delete only auto-generated ones if we had a way to track them. 
        // For now, just insert.
        
        await Appointment.insertMany(appointments);
        console.log(`Successfully seeded ${appointments.length} appointments linking doctors and patients!`);
        process.exit();

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedAppointments();
