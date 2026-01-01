const express = require('express');
const { addReview, getDoctorReviews, getMyReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addReview);
router.get('/my-reviews', protect, getMyReviews);
router.get('/:doctorId', getDoctorReviews);

module.exports = router;
