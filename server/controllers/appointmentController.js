const Appointment = require('../models/Appointment');
const User = require('../models/User');
const sendNotification = require('../utils/notify');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, doctorName, doctorImage, type, fees } = req.body;
    const patientId = req.user.id; 

    // 1. Validation
    if (!doctorId || !date || !time) {
        return res.status(400).json({ message: 'Please provide doctor, date and time' });
    }

    // 2. Check Availability
    const existingAppointment = await Appointment.findOne({ doctorId, date, time, status: 'confirmed' });
    if (existingAppointment) {
        return res.status(400).json({ message: 'Doctor is not available at this time slot.' });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      doctorName, // Save snapshot
      doctorImage,
      date,
      time,
      reason,
      status: 'confirmed',
      type: type || 'video', // Default fallback
      fees: fees || 30
    });
    await appointment.save();

    // 3. Notifications
    await sendNotification(patientId, `Appointment confirmed for ${date} at ${time}.`, 'success');
    
    // Notify Doctor (Only if valid ObjectId, i.e., real doctor)
    if (doctorId.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const doctorUser = await User.findById(doctorId);
            if (doctorUser) {
                await sendNotification(doctorId, `New Appointment: ${req.user.name || 'Patient'} booked for ${date} at ${time}.`, 'info');
            }
        } catch (err) {
            console.log("Skipping notification for doctor (likely mock or invalid ID):", doctorId);
        }
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    console.log(`[DEBUG] getMyAppointments called by UserID: ${req.user.id}`);
    // 1. Fetch raw appointments (No populate to avoid CastErrors on mock IDs)
    const appointments = await Appointment.find({ patientId: req.user.id }).sort({ date: -1 }).lean();
    console.log(`[DEBUG] Found ${appointments.length} appointments for UserID: ${req.user.id}`);

    // 2. Extract valid Doctor ObjectIds for manual lookup
    // Only filter for strings that look like valid 24-char hex ObjectIds to prevent crashes
    const validDoctorIds = [...new Set(appointments
        .map(a => a.doctorId)
        .filter(id => id && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))
    )];

    // 3. Fetch Doctor Details
    let doctors = [];
    if (validDoctorIds.length > 0) {
        doctors = await User.find({ _id: { $in: validDoctorIds } }, 'name specialization image').lean();
    }
    
    // Create a Lookup Map for O(1) access
    const doctorMap = {};
    doctors.forEach(doc => {
        doctorMap[doc._id.toString()] = doc;
    });

    // 4. Fetch Prescriptions
    const Prescription = require('../models/Prescription');
    const prescriptions = await Prescription.find({ patientId: req.user.id }).lean();
    
    // 5. Merge Data
    const result = appointments.map(apt => {
        try {
            // Determine Doctor Details
            // Priority: 1. Real User DB lookup, 2. Snapshot in Appointment, 3. Fallback
            let docDetails = doctorMap[apt.doctorId ? apt.doctorId.toString() : ''] || {};
            
            // If manual lookup failed (e.g. mock ID), check snapshot
            const finalDocName = docDetails.name || apt.doctorName || 'Unknown Doctor';
            const finalDocImage = docDetails.image || apt.doctorImage || '/assets/doctors/dr_male.jpg';
            const finalDocSpec = docDetails.specialization || 'General';

            const hasPrescription = prescriptions.find(p => {
                if (!p.doctorId || !apt.doctorId) return false;
                if (!p.date || !apt.date) return false; 

                // Loose equality for IDs (one might be string, other object)
                const isSameDoc = p.doctorId.toString() === apt.doctorId.toString();
                
                const pDate = new Date(p.date);
                const aDate = new Date(apt.date);
                
                const isSameDay = pDate.getDate() === aDate.getDate() &&
                                  pDate.getMonth() === aDate.getMonth() &&
                                  pDate.getFullYear() === aDate.getFullYear();
                
                return isSameDoc && isSameDay; 
            });
            
            return { 
                ...apt,
                doctorId: {
                    _id: apt.doctorId, // Keep the ID as stored
                    name: finalDocName,
                    image: finalDocImage,
                    specialization: finalDocSpec
                },
                hasPrescription: !!hasPrescription, 
                prescriptionId: hasPrescription?._id 
            };
        } catch (innerErr) {
            console.error(`Error mapping appointment ${apt._id}:`, innerErr);
             return { 
                ...apt,
                doctorId: { name: 'Error Loading Doctor', image: '' },
                hasPrescription: false 
            };
        }
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id })
      .populate('patientId', 'name email phone medicalHistory')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.doctorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();

    await sendNotification(appointment.patientId, `Your appointment on ${new Date(appointment.date).toLocaleDateString()} is ${status}`, 'info');

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.patientId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const existing = await Appointment.findOne({ doctorId: appointment.doctorId, date, time, status: 'confirmed' });
    
    if (existing) {
        return res.status(400).json({ message: 'Doctor unavailable at this time' });
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'rescheduled';
    await appointment.save();

    await sendNotification(appointment.doctorId, `Appointment rescheduled by patient to ${date} at ${time}`, 'info');
    await sendNotification(req.user.id, `You rescheduled your appointment to ${date} at ${time}`, 'success');

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.patientId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    await sendNotification(appointment.doctorId, `Appointment cancelled by patient`, 'warning');
    await sendNotification(req.user.id, `Appointment cancelled successfully`, 'success');

    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
