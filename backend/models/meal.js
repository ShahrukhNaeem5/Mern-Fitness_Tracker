const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    mealName: {
        type: String,
        required: true,
        trim: true
    },
    mealCategory: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] // Limiting options for categories
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    carbohydrates: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Meal = mongoose.model('Meal', MealSchema);
module.exports = Meal;
