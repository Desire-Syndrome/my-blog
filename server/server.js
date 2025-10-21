const dotenv = require("dotenv");
dotenv.config();

// connect Middleware
const express = require("express");
const cors = require("cors");

// connect Configs
const connectDB = require('./configs/db.js');

  
// setup Middleware
const app = express();
app.use(cors());
app.use(express.json());


// use files from server
const path = require("path");
app.use('/uploads', express.static(path.join(__dirname, 'data', 'uploads')));


// Routes
// test and seeder
app.get('/', (req, res) => { res.json({ message: 'API works!' }); });
const databaseSeeder = require('./databaseSeeder.js');
app.use('/server/seed', databaseSeeder);
// api routes



// Setup and Run Server
const PORT = process.env.PORT || 3000; 
connectDB(); 
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))


// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
  });
});


module.exports = app;