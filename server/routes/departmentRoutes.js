const express = require('express');
const { getDepartments, createDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getDepartments);
router.post('/', protect, authorize('admin'), createDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);

module.exports = router;
