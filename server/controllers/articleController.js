const AsyncHandler = require('express-async-handler');

const generateToken = require('../middleware/tokenGenerate');

const { saveUploadedFile, deleteUploadedFile } = require('../middleware/multer.js');

const Article = require("../models/Article.js");


const getArticles = AsyncHandler(async (req, res) => {
	const articles = await Article.find().sort({ _id: -1 })
    .populate("author", "name avatar");

  if (articles.length === 0) {
    return res.status(200).json({  articles: [] });
  }

  return res.status(200).json({ articles });
});


const getArticle = AsyncHandler(async (req, res) => {
	const { id } = req.params;

	const article = await Article.findById(id)
    .populate("author", "name avatar")
		.populate("reviews.user", "name avatar");

	if (!article) {
		return res.status(404).json({ message: "Article not found." });
	}

	return res.status(200).json({ article });
});


const getUserArticles = AsyncHandler(async (req, res) => {
  const userId = req.params.id;

  const articles = await Article.find({ author: userId });
  if (articles.length === 0) {
		return res.status(404).json({  articles: [] });
    
  } 

	return res.status(200).json({ articles });
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