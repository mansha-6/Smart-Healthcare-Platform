const express = require('express');
const { uploadReport, getMyReports, getPatientReports, uploadPrescription, deleteReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/s3');
const router = express.Router();

// Patient routes
router.post('/upload', protect, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Multer specific error:', err);
            // Return 500 or 400 depending, but include message for debugging
            return res.status(500).json({ message: 'Upload Middleware Failed', error: err.message, stack: err.stack });
        }
        next();
    });
}, uploadReport);
router.get('/my-reports', protect, getMyReports);
router.delete('/:id', protect, deleteReport);

// Doctor routes
router.get('/patient/:patientId', protect, authorize('doctor'), getPatientReports);
router.post('/upload-prescription', protect, authorize('doctor'), upload.single('file'), uploadPrescription);

module.exports = router;
