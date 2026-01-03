const mongoose = require('mongoose');
const Appointment = require('./server/models/Appointment');
require('dotenv').config({ path: './server/.env' });

const testLogic = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/smart_healthcare'); // Use localhost for this script outside docker
        
        // Emulate the ID found in logs
        const userId = '6957b4c20f2b102023d31497';
        
        const appointments = await Appointment.find({ patientId: userId }).lean();
        console.log(`Fetched ${appointments.length} raw appointments.`);
        
        // Frontend Logic EXACT COPY
        const past = appointments.filter(app => {
            const appDate = new Date(app.date);
            const today = new Date(); // Simulating client today
            today.setHours(0,0,0,0);
            
            const isPast = appDate < today;
            const isCompleted = app.status === 'completed';
            const isCancelled = app.status === 'cancelled';
            
            console.log(`Checking App ${app._id}: Date=${appDate.toISOString().split('T')[0]}, Status=${app.status} => Past?${isPast}, Completed?${isCompleted}, Cancelled?${isCancelled}`);
            
            return appDate < today || app.status === 'completed' || app.status === 'cancelled';
        });
        
        console.log(`\nFiltered Result Count: ${past.length}`);
        
        if (past.length === 0) {
            console.log("LOGIC VERDICT: The filter removes everything.");
        } else {
            console.log("LOGIC VERDICT: Items SHOULD appear.");
        }

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
testLogic();
