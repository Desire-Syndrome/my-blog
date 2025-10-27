const AsyncHandler = require('express-async-handler');

const { updateArticleRating } = require('../controllers/articleController.js');

const Article = require("../models/Article.js");
const User = require("../models/User.js");
const Review = require("../models/Review.js");


const postReview = AsyncHandler(async (req, res) => {
	const userId = req.account._id;
	const { rating, comment, articleId } = req.body;

	const user = await User.findById(userId);
	if (!user) {
		return res.status(400).json({ message: "Please log in first." });
	}
	if (!user.isConfirmed) {
		return res.status(400).json({ message: "Email not confirmed. Please confirm your email first." });
	}
	if (user.isBanned) {
		return res.status(400).json({ message: `You were banned until ${user.banExpiresAt.toLocaleString()}` });
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
	await updateArticleRating(articleId);
	return res.status(201).json({
		message: "Review added successfully.",
		review
	});
});


const updateReview = AsyncHandler(async (req, res) => {
	const userId = req.account._id;
	const reviewId = req.params.reviewId;
	const { rating, comment } = req.body;

	const user = await User.findById(userId);
	if (!user) {
		return res.status(400).json({ message: "Please log in first." });
	}
	if (user.isBanned) {
		return res.status(400).json({ message: `You were banned until ${user.banExpiresAt.toLocaleString()}` });
	}

	const review = await Review.findById(reviewId);
	if (!review) {
		return res.status(404).json({ message: "Review not found." });
	}

	if (review.user.toString() !== userId.toString() && !req.account.isAdmin) {
		return res.status(403).json({ message: "You don't have permission to update this review." });
	}

	if (!rating || rating < 1 || rating > 5) {
		return res.status(400).json({ message: "Please rate from 1 to 5." });
	}

	review.rating = rating;
	review.comment = comment || review.comment;
	await review.save();
	await updateArticleRating(review.article);
	return res.status(200).json({
		message: "Review updated successfully.",
		review
	});
});


const deleteReview = AsyncHandler(async (req, res) => {
	const userId = req.account._id;
	const reviewId = req.params.reviewId;

	const user = await User.findById(userId);
	if (!user) {
		return res.status(400).json({ message: "Please log in first." });
	}
	if (user.isBanned) {
		return res.status(400).json({ message: `You were banned until ${user.banExpiresAt.toLocaleString()}` });
	}

	const review = await Review.findById(reviewId);
	if (!review) {
		return res.status(404).json({ message: "Review not found." });
	}

	if (review.user.toString() !== userId.toString() && !req.account.isAdmin) {
		return res.status(403).json({ message: "You don't have permission to update this review." });
	}

	const articleId = review.article;
	await review.deleteOne();
	await updateArticleRating(articleId);
	return res.status(200).json({ message: "Review deleted successfully." });
});


const getUserReviews = AsyncHandler(async (req, res) => {
	const userId = req.params.userId;

	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({ message: "User not found." });
	}

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 12;
	const skip = (page - 1) * limit;
	const totalReviews = await Review.countDocuments({ user: userId });

	const reviews = await Review.find({ user: userId }).sort({ _id: -1 }) 
		.populate("article", "title _id")
		.skip(skip).limit(limit);
	if (reviews.length === 0) {
		return res.status(404).json({ reviews: [] });
	}

	return res.status(200).json({ 
		reviews,
		totalPages: Math.ceil(totalReviews / limit), page
	 });
});


module.exports = {
	postReview, updateReview, deleteReview,
	getUserReviews
};