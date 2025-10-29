const mongoose = require("mongoose");


const articleSchema = new mongoose.Schema({
	title: { type: String, required: true },
	image: { type: String },
	shortText: { type: String },
	fullText: { type: String, required: true },
	category: { type: String, required: true },
	rating: { type: Number, default: 0 },
	numReview: { type: Number, default: 0 },
	author:  { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
}, { timestamps: true, versionKey: false });


module.exports = mongoose.model("Article", articleSchema);