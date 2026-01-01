const Appointment = require('../models/Appointment');
const User = require('../models/User');
const sendNotification = require('../utils/notify');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, doctorName, type, fees } = req.body;
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
    const appointments = await Appointment.find({ patientId: req.user.id }).populate('doctorId', 'name specialization');
    res.json(appointments);
  } catch (error) {
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
