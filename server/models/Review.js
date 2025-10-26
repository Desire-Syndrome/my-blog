const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
	rating: { type: Number, required: true },
	comment: { type: String },
	user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
	article: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Article" }
}, { timestamps: true, versionKey: false });


module.exports = mongoose.model("Review", reviewSchema);