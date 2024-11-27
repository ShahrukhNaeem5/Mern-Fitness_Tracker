const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const userAccount_Model = require('../models/userAccount');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../frontend/src/upload'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File Filter for Image Validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
    }
};

// Initialize Multer with Storage and File Filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

// Create User Account Function
const createUserAccount = async (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // checking user already created or not 
    const userAvailabilty = await userAccount_Model.findOne({ userEmail });
    if (userAvailabilty) {
        return res.status(400).json({ error: 'Email is already taken ' });
    }

    if (!userName || !userEmail || !userPassword || !profileImage) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Password Hashing
    const genSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userPassword, genSalt);

    // Data insertion in Model
    const newUser = await userAccount_Model.create({
        userName,
        userEmail,
        userPassword: hashPassword,
        userRole:'User',
        userProfileImage: profileImage
    });

    res.status(200).json({ success: "Account Created Successfully !!" })
}

// Get User Account Function
const getUserAccount = async (req, res) => {
    try {
        const users = await userAccount_Model.find(); // Adjust query as per your needs
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete User Account Function
const deleteUserAccount = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the user account from the database
        const deletedUser = await userAccount_Model.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Change User Password Function
const changeUserPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const userId = req.user._id; // Get user ID from token

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    try {
        // Find user by ID
        const user = await userAccount_Model.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if current password matches
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.userPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.userPassword = hashedNewPassword;
        await user.save();

        res.status(200).json({ success: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add this function to your controller
const updateBodyWeight = async (req, res) => {
    const { bodyWeight } = req.body;
    const userId = req.user._id; // Get user ID from token

    if (bodyWeight === undefined) {
        return res.status(400).json({ error: 'Body weight is required' });
    }

    try {
        // Update the user's body weight
        const user = await userAccount_Model.findByIdAndUpdate(
            userId, 
            { bodyWeight }, 
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ 
            success: 'Body weight updated successfully', 
            data: user 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUserAccount,
    upload,
    getUserAccount,
    changeUserPassword,
    deleteUserAccount,
    updateBodyWeight
};
