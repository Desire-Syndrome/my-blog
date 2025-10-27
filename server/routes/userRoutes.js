const router = require('express').Router();
  
const {
  userRegistration, userLogin, userVerify, 
  updateUser, deleteUser, getUserById,
  banUser, unbanUser
} = require('../controllers/userController.js');

const protect = require('../middleware/Auth.js'); 

const { upload } = require('../middleware/multer.js');


router.post('/registration', upload.fields([{ name: 'avatar', maxCount: 1}]), userRegistration);
router.post('/login', userLogin);
router.get('/verify/:token', userVerify);

router.put('/update', protect, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateUser);
router.delete('/delete', protect, deleteUser);

router.get('/get-by-id/:userId', getUserById);

router.put('/ban/:userId', protect, banUser);
router.put('/unban/:userId', protect, unbanUser);


module.exports = router;