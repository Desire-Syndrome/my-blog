const bcrypt = require("bcryptjs"); 

const users = [
	{
		name: "Admin1",
		email: "Admin@1",
		password: bcrypt.hashSync("Admin@1", 10),
		isAdmin: true
	},
	{
		name: "User1",
		email: "User@1",
		password: bcrypt.hashSync("User@1", 10),
	},
	{
		name: "User2",
		email: "User@2",
		password: bcrypt.hashSync("User@2", 10),
	}
]

module.exports = users;