const AsyncHandler = require('express-async-handler');

const { saveUploadedFile, deleteUploadedFile } = require('../middleware/multer.js');

const Article = require("../models/Article.js");
const User = require("../models/User.js");
const Review = require("../models/Review.js");


const getArticles = AsyncHandler(async (req, res) => {
	const totalArticles = await Article.countDocuments();

	const categories = req.query.categories ? req.query.categories.split(",") : [];
  const title = req.query.title || "";

	const filteredArticles = {};
  if (categories.length > 0) { filteredArticles.category = { $in: categories }; }
  if (title) { filteredArticles.title = { $regex: title, $options: "i" }; }
	
	const totalFilteredArticles = await Article.countDocuments(filteredArticles);

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 12;
	const skip = (page - 1) * limit;

	const articles = await Article.find(filteredArticles).sort({ _id: -1 })
		.populate("author", "name image")
		.skip(skip).limit(limit);

	if (articles.length === 0) {
		return res.status(200).json({ 
			articles: [],
			totalPages: Math.ceil(totalFilteredArticles / limit), page, totalArticles
	 });
	}

	return res.status(200).json({
		articles,
		totalPages: Math.ceil(totalFilteredArticles / limit), page, totalArticles
	});
});


const getArticle = AsyncHandler(async (req, res) => {
	const articleId = req.params.articleId;

	const article = await Article.findById(articleId)
		.populate("author", "name image");
	if (!article) {
		return res.status(404).json({ message: "Article not found." });
	}

	const reviews = await Review.find({ article: articleId })
		.populate("user", "name image");

	return res.status(200).json({
		article, reviews
	});
});


const getUserArticles = AsyncHandler(async (req, res) => {
	const userId = req.params.userId;

	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({ message: "User not found." });
	}

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 12;
	const skip = (page - 1) * limit;
	const totalArticles = await Article.countDocuments({author: userId });

	const articles = await Article.find({ author: userId }).sort({ _id: -1 })
		.skip(skip).limit(limit);
 
	return res.status(200).json({
		articles,
		totalPages: Math.ceil(totalArticles / limit), page, totalArticles
	});
});


const postArticle = AsyncHandler(async (req, res) => {
	const userId = req.account._id;
	const { title, shortText, fullText, category } = req.body;

	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({ message: "User not found." });
	}
	if (user.isBanned) {
		return res.status(403).json({ message: `You were banned until ${user.banExpiresAt.toLocaleString()}` });
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
		title, shortText, fullText, category,
		author: userId,
		image: articleImagePath
	});
	return res.status(201).json({
		message: "Article created successfully.",
		article
	});
});


const updateArticle = AsyncHandler(async (req, res) => {
	const articleId = req.params.articleId;
	const userId = req.account._id;

	const article = await Article.findById(articleId);
	if (article) {
		if (req.account.isBanned) {
			return res.status(400).json({ message: `You were banned until ${req.account.banExpiresAt.toLocaleString()}` });
		}
		if (article.author.toString() !== userId.toString() && !req.account.isAdmin) {
			return res.status(403).json({ message: "You don't have permission to update this article." });
		}

		article.title = req.body.title || article.title;
		article.shortText = req.body.shortText || article.shortText;
		article.fullText = req.body.fullText || article.fullText;
		article.category = req.body.category || article.category;

		if (req.files?.articleImage && req.files.articleImage.length > 0) {
			if (article.image) {
				await deleteUploadedFile(article.image);
			}
			const articleImagePath = await saveUploadedFile(req.files.articleImage[0], "articleImage");
			article.image = articleImagePath;
		}

		const updatedArticle = await article.save();
		return res.status(200).json({
			message: "Article updated successfully.",
			updatedArticle
		});
	} else {
		return res.status(404).json({ message: "Article not found." });
	}
});


const deleteArticle = AsyncHandler(async (req, res) => {
	const articleId = req.params.articleId;
	const userId = req.account._id;

	const article = await Article.findById(articleId);
	if (article) {
		if (req.account.isBanned) {
			return res.status(400).json({ message: `You were banned until ${req.account.banExpiresAt.toLocaleString()}` });
		}
		if (article.author.toString() !== userId.toString() && !req.account.isAdmin) {
			return res.status(403).json({ message: "You don't have permission to delete this article." });
		}

		if (article.image) {
			await deleteUploadedFile(article.image);
		}

		await Review.deleteMany({ article: articleId });
		await article.deleteOne();
		return res.status(200).json({ message: "Article deleted successfully." });
	} else {
		return res.status(404).json({ message: "Article not found." });
	}
});


const updateArticleRating = AsyncHandler(async (articleId) => {
	const allReviews = await Review.find({ article: articleId });

	const numReviews = allReviews.length;
	const averageRating = numReviews === 0 ? 0 : allReviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

	await Article.findByIdAndUpdate(articleId, {
		numReview: numReviews,
		rating: averageRating
	});
});


module.exports = {
	getArticles, getArticle, getUserArticles,
	postArticle, updateArticle, deleteArticle,
	updateArticleRating
};