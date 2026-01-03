const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const check = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        
        const patients = await User.find({ role: 'patient' }, 'name email _id');
        console.log(`Total Patients: ${patients.length}`);
        
        patients.forEach(p => {
            console.log(`- ${p.name} (${p.email}) ID: ${p._id}`);
        });
        
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();
