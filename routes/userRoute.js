// userRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js'); // Assuming User model is defined in models/User.js

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: 'mail.jcspay.com', // SMTP host for JCSPay
  port: 465, // SMTP port for secure connection (SSL)
  secure: true, // Use SSL for the connection
  auth: {
    user: 'support@jcspay.com', // Email account username
    pass: 'heel@5552HEEL', // Email account password
  }
});



// User registration route
// User registration route
router.post('/register', async (req, res) => {
  const { fullname, email, password, mobile, websiteUrl, selectedOption } = req.body;

  if (!email || !password || !mobile) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      mobile,
      websiteUrl,
      selectedOption,
    });

    // Save the user to the database
    await newUser.save();

    // Send the confirmation email to the user
    const mailOptions = {
      from: 'support@jcspay.com',
      to: email,
      subject: 'Welcome to JCSPay!',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
            <table role="presentation" style="width: 100%; background-color: #ffffff; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 20px; background-color: #0066cc; color: white;">
                  <h2 style="margin: 0;">Welcome to JCSPay!</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; text-align: center;">
                  <p style="font-size: 18px; color: #333333;">
                    Dear <strong>${fullname}</strong>,
                  </p>
                  <p style="font-size: 16px; color: #333333;">
                    Thank you for registering with JCSPay. Your account has been successfully created. We are excited to have you on board.
                  </p>
                  <p style="font-size: 16px; color: #333333;">
                    If you have any questions or need assistance, feel free to reach out to our support team.
                  </p>
                  <p style="font-size: 16px; color: #333333;">
                    Best Regards,<br />
                    JCSPay Support Team
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f1f1f1; padding: 20px; text-align: center;">
                  <p style="font-size: 12px; color: #666666;">
                    &copy; ${new Date().getFullYear()} JCSPay. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Failed to send confirmation email.' });
      }
      
      // Debugger: log success and response from the email service
      console.log('Email sent: ' + info.response);
      // Optionally, log the email content for debugging (not recommended in production for security reasons)
      console.log('Email content:', mailOptions);

      // Respond with success
      res.status(201).json({ message: 'User created successfully.', user: newUser });
    });
  } catch (err) {
    console.error('Error during registration:', err); // Log any registration errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      userId: user._id,
      email: user.email,
    };

    // You can adjust the token expiry time based on your needs
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user data
    res.status(200).json({
      message: 'Login successful',
      token, // Send the token to the client
      user: { email: user.email, mobile: user.mobile, website: user.website },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
