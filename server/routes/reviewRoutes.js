const router = require('express').Router();
  
const {
	postReview, updateReview, deleteReview
} = require('../controllers/reviewController.js');

const protect = require('../middleware/Auth.js'); 


router.post('/:articleId', protect, postReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);


module.exports = router;