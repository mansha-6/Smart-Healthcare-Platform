// Isolated test server to check if routes are loading correctly
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock Auth Middleware to bypass need for tokens during basic route check
const mockProtect = (req, res, next) => {
    req.user = { id: 'test_user_id', role: 'patient' };
    next();
};

// Import Routes directly
try {
    const authRoutes = require('./routes/authRoutes');
    const patientRoutes = require('./routes/patientRoutes');
    const doctorRoutes = require('./routes/doctorRoutes');
    const reviewRoutes = require('./routes/reviewRoutes');
    
    // Mount them
    app.use('/api/auth', authRoutes); // Needed for registration
    app.use('/api/patient', patientRoutes);
    app.use('/api/doctor', doctorRoutes);
    app.use('/api/reviews', reviewRoutes); // Debugging 500 error
    console.log('Routes mounted successfully');
} catch (e) {
    console.error('Error mounting routes:', e);
}

const PORT = 5002;
// DB Connection not strictly needed to test 404 vs 401/200 route existence,
// but let's connect to be sure controllers don't crash on init.
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_healthcare')
    .then(() => console.log('DB Connected'))
    .catch(e => console.error('DB Error', e));

app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Try: http://localhost:${PORT}/api/patient/ping`);
});
