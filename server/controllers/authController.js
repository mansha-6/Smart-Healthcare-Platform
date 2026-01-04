const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience, fees, phone, address, medicalHistory, gender, age } = req.body;
    console.log('Register Request Body:', JSON.stringify(req.body, null, 2));

    // Check for existing user with SAME email AND role
    let user = await User.findOne({ email, role });
    console.log('Existing User Check Result:', user ? `Found User: ${user.email} (${user.role})` : 'No User Found');

    if (user) {
        console.log('Returning 400: User already exists');
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse medicalHistory if it's a string (from textarea)
    let parsedHistory = [];
    if (typeof medicalHistory === 'string') {
        parsedHistory = medicalHistory.split(',').map(item => item.trim()).filter(i => i);
    } else if (Array.isArray(medicalHistory)) {
        parsedHistory = medicalHistory;
    }

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      specialization,
      experience: experience === '' ? undefined : experience,
      fees: fees === '' ? undefined : fees,
      phone,
      address,
      gender: gender === '' ? undefined : gender,
      age: age === '' ? undefined : age,
      medicalHistory: parsedHistory
    });

    await user.save();
    console.log('User created:', { id: user._id, email: user.email, role: user.role });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body; // Role is now required/optional but useful for disambiguation

    // 1. Try to find user by email AND role (Priority: Explicit Intent)
    let user = await User.findOne({ email, role });

    // 2. If not found, try to find ANY user with that email (Fallback: Fix for default role mismatch)
    // This handles cases where a Doctor logs in but the UI defaulted to 'patient'
    if (!user) {
        user = await User.findOne({ email });
    }
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
