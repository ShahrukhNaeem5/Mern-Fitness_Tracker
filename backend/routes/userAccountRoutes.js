const express = require('express');
const router = express.Router();
const { getUserAccount, createUserAccount, upload, deleteUserAccount, changeUserPassword, updateBodyWeight } = require('../controllers/userAccountController');
const { protect } = require('../middleware/authMiddleware');


// GET and POST for user account
router.route('/')
    .get(getUserAccount)
    .post(upload.single('profileImage'), createUserAccount);

// Change Password Route (Protected)
router.route('/changePassword')
    .put(protect, changeUserPassword);

router.route('/bodyweight')
    .put(protect, updateBodyWeight); // Add this line

// PUT and DELETE for updating and deleting user accounts
router.route('/:id')
    .delete(deleteUserAccount);


module.exports = router;
