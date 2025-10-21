const jwt = require("jsonwebtoken"); 

const AsyncHandler = require('express-async-handler'); 

const User = require("../models/User.js"); 


const protect = AsyncHandler(async(req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
		try	{
			token = req.headers.authorization.split(" ")[1];
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			const account = await User.findById(decodedToken.id).select("-password");
			req.account = account;
			next();
		} catch(err) {
			res.status(401);
			throw new Error("Not authorized, token failed");
		}
	}
	if(!token){
		res.status(401);
		throw new Error("Not authorized, no token");
	}
}) 


module.exports = protect;