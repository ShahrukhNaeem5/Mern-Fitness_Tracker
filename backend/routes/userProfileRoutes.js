const express = require('express');
const { getProfile, updateProfile, upload } = require('../controllers/userProfileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get user profile, protected by JWT middleware
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

module.exports = router;
