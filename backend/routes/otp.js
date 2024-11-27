const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();
let otps = {}; // Store OTPs in memory for simplicity

// Send OTP to user email
router.post('/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a random 6-digit OTP
    otps[email] = otp; // Store OTP against email

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shahrukhaptech5@gmail.com', // Replace with your email
            pass: 'mzoi ukhw fzek qnmr'
        }
    });

    const mailOptions = {
        from: 'shahrukhaptech5@gmail.com', // Replace with your email
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to send OTP' });
        }
        res.status(200).json({ message: 'OTP sent to your email' });
    });
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otps[email] && otps[email] === otp) {
        delete otps[email]; // Remove OTP after verification
        return res.status(200).json({ message: 'OTP verified successfully' });
    }

    return res.status(400).json({ error: 'Invalid OTP' });
});

module.exports = router;
