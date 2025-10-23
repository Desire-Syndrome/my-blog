const AsyncHandler = require('express-async-handler');

const generateToken = require('../middleware/tokenGenerate');

const { saveUploadedFile, deleteUploadedFile } = require('../middleware/multer.js');

const User = require("../models/User.js");
const Article = require("../models/Article.js");


const userRegistration = AsyncHandler(async (req, res) => {

});


const userLogin = AsyncHandler(async (req, res) => {

});


const userVerify = AsyncHandler(async (req, res) => {

});


const updateUser = AsyncHandler(async (req, res) => {

});


const deleteUser = AsyncHandler(async (req, res) => {

});


const getUserById = AsyncHandler(async (req, res) => {

});


module.exports = { userRegistration, userLogin, userVerify, updateUser, deleteUser, getUserById };