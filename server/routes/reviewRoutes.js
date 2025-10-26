const router = require('express').Router();
  
const {
	postReview, updateReview, deleteReview
} = require('../controllers/reviewController.js');

const protect = require('../middleware/Auth.js'); 


router.post('/post', protect, postReview);
router.put('/update/:reviewId', protect, updateReview);
router.delete('/delete/:reviewId', protect, deleteReview);


module.exports = router;