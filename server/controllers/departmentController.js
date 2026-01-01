const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public (or Protected)
exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('head', 'name specialization');
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new department
// @route   POST /api/departments
// @access  Admin
exports.createDepartment = async (req, res) => {
    try {
        const { name, head, description, icon, bg } = req.body;

        const department = await Department.create({
            name,
            head,
            description,
            icon: icon || 'Building2',
            bg: bg || 'bg-blue-500'
        });

        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Admin
exports.deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Department deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
