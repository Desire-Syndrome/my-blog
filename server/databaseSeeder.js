const router = require('express').Router();

const AsyncHandler = require('express-async-handler');  

const User = require('./models/User');
const Article = require('./models/Article');

const users = require('./data/json/Users');
const articles = require('./data/json/Articles');
const reviews = require('./data/json/Reviews');


// Routes 
router.post('/users', AsyncHandler(
	async (req, res) => {
		await User.deleteMany({});
		const UserSeeder = await User.insertMany(users);
		res.status(201).json({ UserSeeder });
	})
);

router.post('/articles', AsyncHandler(
	async (req, res) => {
		await Article.deleteMany({});
		const ArticleSeeder = await Article.insertMany(articles);
		res.status(201).json({ ArticleSeeder });
	})
);

router.post('/reviews', AsyncHandler(
	async (req, res) => {
		await Review.deleteMany({});
		const ReviewSeeder = await Review.insertMany(reviews);
		res.status(201).json({ ReviewSeeder });
	})
);


module.exports = router;