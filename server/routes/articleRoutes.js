const router = require('express').Router();
  
const {
  getArticles, getArticle, getUserArticles, postArticle, updateArticle, deleteArticle, postReview, updateReview, deleteReview
} = require('../controllers/articleController.js');

const protect = require('../middleware/Auth.js'); 

const { upload } = require('../middleware/multer.js');


router.get('/', getArticles);
router.get('/:id', getArticle);
router.get('/user/:id', getUserArticles);

router.post('/', protect, upload.fields([{ name: 'article', maxCount: 1}]), postArticle);
router.put('/:id', protect, upload.fields([{ name: 'article', maxCount: 1}]), updateArticle);
router.delete('/:id', protect, deleteArticle);

router.post('/:id/reviews', protect, postReview);
router.post('/:articleId/reviews/:reviewId', protect, updateReview);
router.post('/:articleId/reviews/:reviewId', protect, deleteReview);


module.exports = router;