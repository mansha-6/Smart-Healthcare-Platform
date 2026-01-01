const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_healthcare');
        const count = await User.countDocuments({ role: 'doctor' });
        const doc = await User.findOne({ role: 'doctor', email: 'eion@example.com' }); // Check for one of our seeded docs
        console.log(`Doctors count: ${count}`);
        if(doc) {
            console.log(`Found Dr. ${doc.name}`);
            console.log(`Bio present: ${!!doc.bio}`);
            console.log(`Schedule present: ${!!doc.schedule}`);
        } else {
            console.log('Target doctor not found');
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();
