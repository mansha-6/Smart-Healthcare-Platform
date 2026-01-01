const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { specialization, experience, fees, isAvailable, phone, address } = req.body;
    
    // Build update object
    const updateFields = {};
    if (specialization) updateFields.specialization = specialization;
    if (experience) updateFields.experience = experience;
    if (fees) updateFields.fees = fees;
    if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (req.body.bio) updateFields.bio = req.body.bio;
    if (req.body.schedule) updateFields.schedule = req.body.schedule;

    const doctor = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.getDoctorStats = async (req, res) => {
    console.log('getDoctorStats: START - Headers:', req.headers);
    try {
        console.log('getDoctorStats: User object:', req.user);
        
        if (!req.user || !req.user.id) {
             console.error('getDoctorStats: ERROR - No doctor ID in request user', req.user);
             return res.status(400).json({ message: 'Invalid User ID' });
        }

        const doctorId = req.user.id;
        console.log('getDoctorStats: Doctor ID:', doctorId);

        // 1. Get Doctor Profile & Fees
        let fees = 50;
        try {
            console.log('getDoctorStats: Fetching doctor profile...');
            const doctor = await User.findById(doctorId);
            console.log('getDoctorStats: Doctor found:', doctor ? 'Yes' : 'No');
            if (doctor && doctor.fees) fees = doctor.fees;
        } catch (err) {
            console.error('getDoctorStats: Error fetching doctor profile', err);
        }

        // 2. Count Total Patients (Unique)
        let totalPatients = 0;
        try {
            console.log('getDoctorStats: Counting patients...');
            const patients = await Appointment.distinct('patientId', { doctorId });
            totalPatients = patients ? patients.length : 0;
            console.log('getDoctorStats: Patients count:', totalPatients);
        } catch (err) {
            console.error('getDoctorStats: Error counting patients', err);
        }

        // 3. Count Appointments for Today
        let todayAppointments = 0;
        try {
            console.log('getDoctorStats: Counting today apps...');
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            
            todayAppointments = await Appointment.countDocuments({
                doctorId,
                date: { $gte: startOfDay, $lte: endOfDay }
            });
            console.log('getDoctorStats: Today apps:', todayAppointments);
        } catch (err) {
            console.error('getDoctorStats: Error counting today apps', err);
        }

        // 4. Calculate Earnings
        let earnings = 0;
        try {
            console.log('getDoctorStats: Calculating earnings...');
            const completedApps = await Appointment.countDocuments({ doctorId, status: 'completed' });
            earnings = completedApps * fees;
            console.log('getDoctorStats: Earnings:', earnings);
        } catch (err) {
            console.error('getDoctorStats: Error calculating earnings', err);
        }

        const responseData = {
            todayAppointments,
            totalPatients,
            earnings
        };
        console.log('getDoctorStats: SENDING RESPONSE', responseData);
        res.json(responseData);

    } catch (error) {
        console.error('CRITICAL Error in getDoctorStats:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getDoctorPatientMappings = async (req, res) => {
    try {
        // Find all doctors
        const doctors = await User.find({ role: 'doctor' }).select('name specialization fees image');
        
        const mappings = [];

        for (const doctor of doctors) {
            // Find distinct patients for this doctor
            const patientIds = await Appointment.distinct('patientId', { doctorId: doctor._id });
            
            // Get patient details
            const patients = await User.find({ 
                _id: { $in: patientIds } 
            }).select('name email phone gender age');

            mappings.push({
                doctor,
                patients
            });
        }

        res.json(mappings);
    } catch (error) {
        console.error('Error fetching doctor-patient mappings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
