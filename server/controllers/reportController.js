const Report = require('../models/Report');

exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Multer diskStorage populates `req.file.path` and `req.file.filename`.
    // multer-s3 populates `req.file.location`. Support both and fallback.
    const fileUrl = req.file.location || req.file.path || (req.file.filename ? (`uploads/${req.file.filename}`) : undefined);
    console.log('uploadReport received req.file:', req.file);
    if (!fileUrl) {
      console.error('No fileUrl could be constructed; check multer storage configuration.');
      return res.status(500).json({ message: 'Server Error', error: 'File stored but file URL could not be derived' });
    }
    console.log('Uploaded file info:', { originalname: req.file.originalname, path: req.file.path, location: req.file.location, mimetype: req.file.mimetype });

    const report = new Report({
      patientId: req.user.id,
      title: req.body.title || req.file.originalname,
      fileUrl: fileUrl,
      type: req.file.mimetype
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error('uploadReport error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.user.id });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const reports = await Report.find({ patientId }).sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.uploadPrescription = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const { patientId, title } = req.body;

        const fileUrl = req.file.location || req.file.path || (req.file.filename ? `uploads/${req.file.filename}` : undefined);

        const report = new Report({
            patientId,
            doctorId: req.user.id,
            title: title || 'Prescription',
            fileUrl,
            type: 'prescription',
            date: Date.now()
        });

        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message, stack: error.stack });
    }
};
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (report.patientId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await report.deleteOne();
        res.json({ message: 'Report removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
