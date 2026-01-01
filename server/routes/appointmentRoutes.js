const express = require('express');
const { bookAppointment, getMyAppointments, getDoctorAppointments, updateAppointmentStatus, rescheduleAppointment, cancelAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', protect, bookAppointment);
router.get('/history', protect, getMyAppointments);

// Doctor Routes
router.get('/doctor-appointments', protect, authorize('doctor'), getDoctorAppointments);
router.put('/:id/status', protect, authorize('doctor'), updateAppointmentStatus);

// Patient Actions
router.put('/reschedule/:id', protect, rescheduleAppointment);
router.delete('/cancel/:id', protect, cancelAppointment);

module.exports = router;
