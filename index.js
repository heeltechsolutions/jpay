// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute'); // Import the routes from userRoutes.js
const connectDb = require('./utils/db'); // Make sure the path to db.js is correct
const dotenv = require('dotenv');

// Initialize express app
const app = express();
dotenv.config();
const port = process.env.PORT 

// Configure dotenv to load environment variables


// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse incoming JSON requests

// Connect to the database
connectDb();

// Use the routes from userRoutes.js
app.use('/api/users', userRoutes); // The '/api/users' is the base path for user routes

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
