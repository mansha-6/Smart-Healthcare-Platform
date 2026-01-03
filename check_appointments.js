const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });
const Appointment = require('./server/models/Appointment');

const checkAppointments = async () => {
    try {
        const uri = 'mongodb://localhost:27017/smart_healthcare';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const appointments = await Appointment.find().populate('patientId doctorId');
        console.log(`Found ${appointments.length} appointments.`);
        
        appointments.forEach(app => {
            console.log(`ID: ${app._id}`);
            console.log(`Date: ${app.date}`);
            console.log(`Status: ${app.status}`);
            console.log(`Patient: ${app.patientId?.name}`);
            console.log(`Doctor: ${app.doctorId?.name}`);
            console.log('-------------------');
        });

        const pastAppointments = appointments.filter(app => {
            const appDate = new Date(app.date);
            const today = new Date();
            today.setHours(0,0,0,0);
            return appDate < today || app.status === 'completed' || app.status === 'cancelled';
        });

        console.log(`\nMatching 'History' criteria: ${pastAppointments.length}`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAppointments();
