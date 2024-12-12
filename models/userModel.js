// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: false, unique: false },
  fullname: { type: String, required: false, unique: false },
  password: { type: String, required: false },
  mobile: { type: String, required: false },
  websiteUrl: { type: String, required: false },
  selectedOption: { type: String, required: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
