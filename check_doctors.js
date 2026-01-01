const mongoose = require('mongoose');
const User = require('./server/models/User');
const dotenv = require('dotenv');
dotenv.config({ path: './server/.env' }); // Adjust path if needed

const mongoUri = 'mongodb://127.0.0.1:27017/smart_healthcare';

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected to DB');
    const count = await User.countDocuments({ role: 'doctor' });
    const doctors = await User.find({ role: 'doctor' }).select('name email');
    console.log(`Total Doctors in DB: ${count}`);
    console.log('Doctors:', doctors);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
