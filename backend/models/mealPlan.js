const mongoose = require('mongoose');
const { Schema } = mongoose;

const MealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userAccount', // Assuming you have a User model
        required: true
    },
    day: {
        type: String,
        required: true
    },
    meals: [
        {
            mealId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Meal', // Referencing the Meal model
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    date: { // New field to store the actual date of the meal plan
        type: Date,
        default: Date.now // Automatically sets the date to now if not provided
    }
});

const MealPlan = mongoose.model('MealPlan', MealPlanSchema);
module.exports = MealPlan;
