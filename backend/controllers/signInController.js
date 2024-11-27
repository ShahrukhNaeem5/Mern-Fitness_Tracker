const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken');
const userModel = require('../models/userAccount')


const SignIn = async(req,res)=>{
    const {userEmail,userPassword} = req.body;

    if(!userEmail){
        return res.status(400).json({ error: 'Email is required ' });
    }

    if(!userPassword){
        return res.status(400).json({ error: 'Password is required ' });
    }
    
    
    // find user 
    const userAuth = await userModel.findOne({userEmail});

    
    if(!userAuth){
        return res.status(400).json({ error: 'crediential is wrong ' });
    }
    
    // password authication dcrpt password
    const Password_Auth = await bcrypt.compare(userPassword,userAuth.userPassword);
    
    if(!Password_Auth){
        return res.status(400).json({ error: 'crediential is wrong ' });
    }


    // jwt access

    const token = await jwt.sign(
        {userAuth},
        process.env.SECRET_KEY,
        {expiresIn:'7d'}
    )

    return res.status(200).json({"token":token});
}


module.exports = {SignIn}