const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const patientController = require('../controllers/patientController');

const router = express.Router();
console.log('Patient Routes loaded');

router.get('/ping', (req, res) => res.send('pong'));

router.use(protect);

router.get('/profile', patientController.getProfile);
router.put('/update', patientController.updateProfile);
router.get('/all', patientController.getAllPatients); // New public directory route

// Report routes (aliased in controller)
router.get('/reports', patientController.getPatientReports);
router.post('/upload-report', patientController.uploadReport);

module.exports = router;
