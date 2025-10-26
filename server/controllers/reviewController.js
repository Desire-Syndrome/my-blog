const AsyncHandler = require('express-async-handler');

const Article = require("../models/Article.js");
const User = require("../models/User.js");
const Review = require("../models/Review.js");


const postReview = AsyncHandler(async (req, res) => {
	const articleId = req.params.articleId;
	const userId = req.account._id;
	const { rating, comment } = req.body;

	const user = await User.findById(userId);
	if (!user) {
		return res.status(400).json({ message: "Please log in first." });
	}
	if (!user.isConfirmed) {
		return res.status(400).json({ message: "Email not confirmed. Please confirm your email first." });
	}

	const article = await Article.findById(articleId);
	if (!article) {
		return res.status(404).json({ message: "Article not found." });
	}

	const existingReview = await Review.findOne({ article: articleId, user: userId });
	if (existingReview) {
		return res.status(400).json({ message: "You have already reviewed this article." });
	}

	if (!rating || rating < 1 || rating > 5) {
		return res.status(400).json({ message: "Please rate from 1 to 5." });
	}

	const review = await Review.create({
		article: articleId, user: userId,
		comment, rating
	});

	const allReviews = await Review.find({ article: articleId });
	const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

	article.numReview = allReviews.length;
	article.rating = averageRating;
	await article.save();

	return res.status(201).json({ 
		message: "Review successfully added.", 
		review
	});
});


const updateReview = AsyncHandler(async (req, res) => {

});


const deleteReview = AsyncHandler(async (req, res) => {

});


module.exports = { postReview, updateReview, deleteReview };