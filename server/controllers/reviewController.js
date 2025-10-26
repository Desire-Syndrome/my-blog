const AsyncHandler = require('express-async-handler');

const Article = require("../models/Article.js");
const User = require("../models/User.js");
const Review = require("../models/Review.js");


const postReview = AsyncHandler(async (req, res) => {

});


const updateReview = AsyncHandler(async (req, res) => {

});


const deleteReview = AsyncHandler(async (req, res) => {

});


module.exports = { postReview, updateReview, deleteReview };