const express = require('express');
const { getSystemStats, deleteDoctor, generatePDFReport, createDoctor, createStaff, getStaff } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// All routes here require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getSystemStats);
router.post('/doctor', createDoctor); // Create Doctor
router.post('/staff', createStaff); // Create Staff
router.get('/staff', getStaff); // Get Staff
router.delete('/doctor/:id', deleteDoctor);
router.get('/report', generatePDFReport);

module.exports = router;
