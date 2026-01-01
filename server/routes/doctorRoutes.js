const express = require('express');
const { getAllDoctors, getDoctorById, updateProfile, getDoctorStats, getDoctorPatientMappings } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();
console.log('doctorRoutes loaded');

router.get('/list', getAllDoctors);
router.get('/patient-mappings', protect, getDoctorPatientMappings); // New route
// Doctor Dashboard Routes
router.put('/update', protect, authorize('doctor'), updateProfile);
router.get('/stats', protect, authorize('doctor'), getDoctorStats);
router.get('/appointments', protect, authorize('doctor'), require('../controllers/appointmentController').getDoctorAppointments);

router.get('/:id', getDoctorById);

module.exports = router;
