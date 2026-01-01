const Review = require('../models/Review');
const User = require('../models/User');

exports.addReview = async (req, res) => {
    try {
        const { doctorId, rating, comment } = req.body;
        const patientId = req.user.id;
        const patientName = req.user.name;

        const review = new Review({
            doctorId,
            patientId,
            patientName,
            rating,
            comment
        });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getDoctorReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ doctorId: req.params.doctorId }).sort({ date: -1 });
        res.json(reviews);
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ patientId: req.user.id })
            .populate('doctorId', 'name specialization image')
            .sort({ date: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
