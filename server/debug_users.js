const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'name email role');
        console.log('--- USER DEBUG REPORT ---');
        users.forEach(u => {
            console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: '${u.role}'`);
        });
        console.log('--- END REPORT ---');
        process.exit();
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
};
debug();
