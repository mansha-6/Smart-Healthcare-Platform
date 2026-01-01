const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_healthcare';

mongoose.connect(mongoUri, { dbName: 'smartHealthcareDB' })
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            const result = await User.deleteMany({});
            console.log(`Deleted ${result.deletedCount} users.`);
            process.exit(0);
        } catch (error) {
            console.error('Error deleting users:', error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('Connection Error:', err);
        process.exit(1);
    });
