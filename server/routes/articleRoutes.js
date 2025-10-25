const router = require('express').Router();
  
const {
  getArticles, getArticle, getUserArticles, postArticle, updateArticle, deleteArticle, postReview, updateReview, deleteReview
} = require('../controllers/articleController.js');

const protect = require('../middleware/Auth.js'); 

const { upload } = require('../middleware/multer.js');


router.get('/', getArticles);
router.get('/:articleId', getArticle);
router.get('/user/:userId', getUserArticles);

router.post('/', protect, upload.fields([{ name: 'articleImage', maxCount: 1}]), postArticle);
router.put('/:articleId', protect, upload.fields([{ name: 'articleImage', maxCount: 1}]), updateArticle);
router.delete('/:articleId', protect, deleteArticle);

router.post('/:articleId/reviews', protect, postReview);
router.post('/:articleId/reviews/:reviewId', protect, updateReview);
router.post('/:articleId/reviews/:reviewId', protect, deleteReview);


module.exports = router;