const AsyncHandler = require('express-async-handler');

const generateToken = require('../middleware/tokenGenerate');

const { saveUploadedFile, deleteUploadedFile } = require('../middleware/multer.js');

const { sendConfirmationEmail } = require('../middleware/emailService'); 
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");
const Article = require("../models/Article.js");


const userRegistration = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing details." });
  }
  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must contain at least one uppercase letter and one number."
    });
  }

  let avatarPath = null;
  if (req.files?.avatar && req.files.avatar.length > 0) {
    avatarPath = await saveUploadedFile(req.files.avatar[0], "avatar");
  }

  const user = await User.create({
    name, email, password,
    image: avatarPath
  });

	const confirmationToken = generateToken(user._id); 
	await sendConfirmationEmail(user.email, confirmationToken);

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
		confirmationToken: user.confirmationToken,
    token: null,
    image: user.image || null,
		isConfirmed: user.isConfirmed,
    createAt: user.createAt
  });
});


const userLogin = AsyncHandler(async (req, res) => {

});


const userVerify = AsyncHandler(async (req, res) => {
	const { token } = req.params; 
  
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findById(decoded.id);
			if (user) {
				user.isConfirmed = true;
				await user.save();
				return res.status(200).json({ message: "Email confirmed successfully." });
			} else {
				return res.status(404).json({ message: "User not found." });
			}
		} catch (error) {
			return res.status(400).json({ message: "Invalid or expired token." });
		}
});


const updateUser = AsyncHandler(async (req, res) => {

});


const deleteUser = AsyncHandler(async (req, res) => {

});


const getUserById = AsyncHandler(async (req, res) => {

});


module.exports = { userRegistration, userLogin, userVerify, updateUser, deleteUser, getUserById };