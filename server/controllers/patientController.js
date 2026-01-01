const User = require('../models/User');
const { getPatientReports, uploadReport } = require('./reportController');

// Get Current Patient Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Patient Profile
exports.updateProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (error) {
         res.status(500).json({ message: 'Server Error' });
    }
};

// Get All Registered Patients (Public Directory)
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await User.find({ role: 'patient' }).select('name email phone gender age address');
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Export report controller functions to maintain compatibility with routes that might import from here
exports.getPatientReports = getPatientReports;
exports.uploadReport = uploadReport;
