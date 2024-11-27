const userModel = require('../models/userAccount');
const multer = require('multer');
const path = require('path');

// Get user profile details
const getProfile = async (req, res) => {
    try {
        // req.user will be set by JWT middleware after token verification
        const user = await userModel.findById(req.user._id).select('-userPassword');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// File Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../frontend/src/upload'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
        }
    }
});

// Update User Profile Function
const updateProfile = async (req, res) => {
    try {
        const { userName, userEmail } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        const updatedData = { userName, userEmail };

        if (profileImage) {
            updatedData.userProfileImage = profileImage;
        }

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, updatedData, { new: true }).select('-userPassword'); // Exclude password

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: 'Profile updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export all necessary functions and variables
module.exports = {
    getProfile,
    updateProfile,
    upload
};
