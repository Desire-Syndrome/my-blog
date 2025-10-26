const router = require('express').Router();
  
const {
	postReview, updateReview, deleteReview
} = require('../controllers/reviewController.js');

const protect = require('../middleware/Auth.js'); 


router.post('/:articleId/reviews', protect, postReview);
router.post('/:articleId/reviews/:reviewId', protect, updateReview);
router.post('/:articleId/reviews/:reviewId', protect, deleteReview);


module.exports = router;