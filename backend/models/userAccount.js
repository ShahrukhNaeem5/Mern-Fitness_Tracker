const mongoose = require("mongoose");



const userAccount_Model = mongoose.Schema(
    {

        userName: {
            type: String,
            required: [true, 'Please enter a user name']
        },

        userEmail: {
            type: String,
            required: [true, 'Please enter a user email']
        },

        userPassword: {
            type: String,
            required: [true, 'Please enter a user password']
        },

        userRole:{
            type:String,
        },

        userProfileImage: { 
            type: String,
            required: [true, 'Please select a profile image']
        },

    },
    {
        timestamps: true
    }

)





module.exports = mongoose.model('userAccount', userAccount_Model);