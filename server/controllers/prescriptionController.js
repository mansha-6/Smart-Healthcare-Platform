const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Report = require('../models/Report');
const Notification = require('../models/Notification');
const fs = require('fs');
const path = require('path');

exports.createPrescription = async (req, res) => {
  try {
    console.log('createPrescription Body:', req.body);
    const { patientName, medicines, notes, patientId } = req.body;
    
    let finalPatientId = patientId;

    // 1. Validate provided ID
    if (finalPatientId && !require('mongoose').Types.ObjectId.isValid(finalPatientId)) {
        console.log(`Invalid Patient ID '${finalPatientId}' provided. Attempting to look up by name...`);
        finalPatientId = undefined;
    }

    // 2. Smart Link: Failover to Name Lookup if ID is missing
    if (!finalPatientId && patientName) {
        // Find a user with role 'patient' and matching name (case-insensitive, ignoring trailing spaces)
        // This handles cases where database has "Name " but user types "Name"
        const cleanName = patientName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex chars
        const linkedUser = await User.findOne({ 
            name: { $regex: new RegExp(`^${cleanName}\\s*$`, 'i') },
            role: 'patient' 
        });
        
        if (linkedUser) {
            finalPatientId = linkedUser._id;
            console.log(`Smart Link: Linked '${patientName}' to Patient ID: ${finalPatientId}`);
        } else {
            console.log(`Smart Link: No patient found with name '${patientName}'. Prescripton will be unlinked.`);
        }
    }

    const prescription = new Prescription({
      doctorId: req.user.id,
      patientName,
      patientId: finalPatientId,
      medicines,
      notes
    });

    await prescription.save();

    // --- AUTOMATION START ---
    if (finalPatientId) {
        try {
            // 1. Generate Physical File
            const filename = `prescription-${prescription._id}.txt`;
            const uploadsDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
            
            const filePath = path.join(uploadsDir, filename);
            const content = `SMART HEALTHCARE PLATFORM - OFFICIAL PRESCRIPTION\n\n` +
                            `Doctor: (ID: ${req.user.id})\n` + 
                            `Patient: ${patientName}\n` +
                            `Date: ${new Date().toLocaleString()}\n\n` +
                            `MEDICINES:\n` +
                            medicines.map(m => `- ${m.name} (${m.dosage}) ${m.frequency || ''}`).join('\n') +
                            `\n\nNotes: ${notes || 'None'}\n`;
            
            fs.writeFileSync(filePath, content);
            console.log('Automation: Generated prescription file at', filePath);

            // 2. Create Health Report Entry
            const newReport = new Report({
                patientId: finalPatientId,
                doctorId: req.user.id,
                title: `Prescription: ${new Date().toLocaleDateString()}`,
                fileUrl: `uploads/${filename}`,
                type: 'prescription/txt'
            });
            await newReport.save();
            console.log('Automation: Created Health Report');

            // 3. Send Notification
            const notification = new Notification({
                userId: finalPatientId,
                message: `You have received a new prescription from your doctor. It has been added to your Health Reports.`,
                type: 'success'
            });
            await notification.save();
            console.log('Automation: Sent Notification');

        } catch (autoErr) {
            console.error('Automation Error:', autoErr);
            // Don't fail the request, just log it
        }
    }
    // --- AUTOMATION END ---

    res.status(201).json({
        ...prescription.toObject(),
        isLinked: !!finalPatientId,
        linkedPatientId: finalPatientId
    });
  } catch (error) {
    console.error('Create Prescription Error:', error);
    res.status(500).json({ message: 'Failed to create prescription', error: error.message });
  }
};

exports.getDoctorPrescriptions = async (req, res) => {
  try {
    // Get prescriptions issued BY this doctor
    const prescriptions = await Prescription.find({ doctorId: req.user.id }).sort({ date: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMyPrescriptions = async (req, res) => {
  try {
    // Get prescriptions issued TO this patient
    // If patientId is linked, use it. 
    // For demo purposes, we might also match by name if patientId is missing?
    // Let's stick to strict patientId matching first for security.
    const prescriptions = await Prescription.find({ patientId: req.user.id })
      .populate('doctorId', 'name specialty') // Populate doctor details if available
      .sort({ date: -1 });
      
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
