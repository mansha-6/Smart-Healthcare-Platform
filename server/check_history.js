const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const User = require('./models/User'); // Register User model
require('dotenv').config();

const check = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
        
        const apps = await Appointment.find().populate('patientId', 'name').populate('doctorId', 'name');
        console.log(`Total Appointments: ${apps.length}`);
        if(apps.length > 0) {
            console.log('Sample Appointment:', JSON.stringify(apps[0], null, 2));
        } else {
            console.log('No appointments found.');
        }
        
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();
