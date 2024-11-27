const express = require('express');
const {SignIn} = require('../controllers/signInController');


const router = express.Router();


router.route('/').post(SignIn);


module.exports =router


