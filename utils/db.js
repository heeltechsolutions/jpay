// db.js
const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    // MongoDB URI from environment variable or fallback to localhost
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jpay';

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    // Optionally, you can exit the process if the database connection fails
    process.exit(1);
  }
};

// Export the connection function for use in other parts of the app
module.exports = connectToDatabase;
