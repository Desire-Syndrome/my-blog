const AsyncHandler = require('express-async-handler');

const generateToken = require('../middleware/tokenGenerate');

const { saveUploadedFile, deleteUploadedFile } = require('../middleware/multer.js');

const User = require("../models/User.js");
const Article = require("../models/Article.js");


const getArticles = AsyncHandler(async (req, res) => {

});


const getArticle = AsyncHandler(async (req, res) => {

});


const getUserArticles = AsyncHandler(async (req, res) => {

});


const postArticle = AsyncHandler(async (req, res) => {

});


const updateArticle = AsyncHandler(async (req, res) => {

});


const deleteArticle = AsyncHandler(async (req, res) => {

});


const postReview = AsyncHandler(async (req, res) => {

});


const updateReview = AsyncHandler(async (req, res) => {

});


const deleteReview = AsyncHandler(async (req, res) => {

});


module.exports = { getArticles, getArticle, getUserArticles, postArticle, updateArticle, deleteArticle, postReview, updateReview, deleteReview };