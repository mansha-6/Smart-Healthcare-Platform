const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
require('dotenv').config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const userId = '6957b4c20f2b102023d31497'; // The ID from logs
        
        console.log(`Checking appointments for Patient: ${userId}`);
        const appointments = await Appointment.find({ patientId: userId }).lean();
        console.log(`Found ${appointments.length} raw in DB.`);
        
        // Frontend Logic Simulation
        const past = appointments.filter(app => {
            const appDate = new Date(app.date);
            const today = new Date(); 
            today.setHours(0,0,0,0);
            
            // Debug each
            const cond1 = appDate < today;
            const cond2 = app.status === 'completed';
            const cond3 = app.status === 'cancelled';
            
            console.log(`[${app._id}] Date:${app.date} Status:${app.status} | <Today?${cond1} Completed?${cond2} Cancelled?${cond3}`);
            
            return cond1 || cond2 || cond3;
        });
        
        console.log(`Frontend would show: ${past.length} items.`);
        
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
test();
