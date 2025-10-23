const AsyncHandler = require('express-async-handler');

const generateToken = require('../middleware/tokenGenerate');

const { saveUploadedFile, deleteUploadedFile } = require('../middleware/multer.js');

const Article = require("../models/Article.js");
const User = require("../models/User.js");


const getArticles = AsyncHandler(async (req, res) => {
	const articles = await Article.find().sort({ _id: -1 })
		.populate("author", "name avatar");

	if (articles.length === 0) {
		return res.status(200).json({ articles: [] });
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
		return res.status(404).json({ articles: [] });

	}

	return res.status(200).json({ articles });
});


const postArticle = AsyncHandler(async (req, res) => {
	const userId = req.account._id;
	const { title, shortText, fullText } = req.body;

	const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  if (!user.isConfirmed) {
    return res.status(400).json({ message: "Email not confirmed. Please confirm your email first." });
  }

	if (!title || !fullText) {
		return res.status(400).json({ message: "Title and content are required." });
	}

	let articleImagePath = null;
	if (req.files?.articleImage && req.files.articleImage.length > 0) {
		articleImagePath = await saveUploadedFile(req.files.articleImage[0], "articleImage");
	}

	const article = await Article.create({
		title, shortText, fullText,
		author: userId,
		image: articleImagePath
	});
	return res.status(201).json({ article });
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