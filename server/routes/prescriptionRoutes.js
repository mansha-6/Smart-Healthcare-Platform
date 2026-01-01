const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// POST / - Create (Doctor only)
router.post('/', authorize('doctor'), prescriptionController.createPrescription);

// GET /doctor-prescriptions - List for Doctor
router.get('/doctor-prescriptions', authorize('doctor'), prescriptionController.getDoctorPrescriptions);

// GET /my-prescriptions - List for Patient
router.get('/my-prescriptions', authorize('patient'), prescriptionController.getMyPrescriptions);

module.exports = router;
