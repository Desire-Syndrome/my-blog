const router = require('express').Router();
  
const {
  getArticles, getArticle, getUserArticles, 
  postArticle, updateArticle, deleteArticle
} = require('../controllers/articleController.js');

const protect = require('../middleware/Auth.js'); 

const { upload } = require('../middleware/multer.js');


router.get('/get-all', getArticles);
router.get('/get-by-id/:articleId', getArticle);
router.get('/get-by-user/:userId', getUserArticles);

router.post('/post', protect, upload.fields([{ name: 'articleImage', maxCount: 1}]), postArticle);
router.put('/update/:articleId', protect, upload.fields([{ name: 'articleImage', maxCount: 1}]), updateArticle);
router.delete('/delete/:articleId', protect, deleteArticle);


module.exports = router;