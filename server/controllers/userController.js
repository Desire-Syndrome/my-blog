const AsyncHandler = require('express-async-handler');

const generateToken = require('../middleware/tokenGenerate');

const { saveUploadedFile, deleteUploadedFile } = require('../middleware/multer.js');

const { sendConfirmationEmail } = require('../middleware/emailService'); 
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");


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
    createdAt: user.createdAt
  });
});


const userLogin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      image: user.image || null,
      isConfirmed: user.isConfirmed,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    })
  } else {
    return res.status(401).json({ message: "Invalid Email or Password." });
  }
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
  const { userId } = req.account._id;
  const { name, email, oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);

  if (user) {
    user.name = name || user.name;

    const existUser = await User.findOne({ email });
    if (existUser && existUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "User already exists." });
    } else {
      user.email = email || user.email;
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Please provide old password." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message: "Password must contain at least one uppercase letter and one number."
        });
      }
      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect." });
      }
      user.password = newPassword;
    }

    if (req.files?.avatar && req.files.avatar.length > 0) {
      if (user.image) {
        await deleteUploadedFile(user.image);
      }
      const avatarPath = await saveUploadedFile(req.files.avatar[0], "avatar");
      user.image = avatarPath;
    }

    const updatedUser = await user.save();
    return res.status(200).json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
      image: updatedUser.image || null,
      isConfirmed: updatedUser.isConfirmed,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt
    });
  } else {
    return res.status(404).json({ message: "User not found." });
  }
});


const deleteUser = AsyncHandler(async (req, res) => {
  const { userId } = req.account._id;

  const user = await User.findById(userId);

  if (user) {
    if (user.image) {
      await deleteUploadedFile(user.image);
    }

    await user.deleteOne();
    return res.status(200).json({ message: "User profile deleted successfully." });
  } else {
    return res.status(404).json({ message: "User not found." });
  }
});


const getUserById = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const user = await User.findById(userId); 

	if (user) {
		return res.json({
			name: user.name,
			isAdmin: user.isAdmin,
			image: user.image || null, 
			createdAt: user.createdAt
		});
	} else {
		return res.status(404).json({ message: "User not found." });
	}
});


module.exports = { userRegistration, userLogin, userVerify, updateUser, deleteUser, getUserById };