const express = require('express');
const { body, validationResult } = require('express-validator');
const Meal = require('../models/meal');
const MealPlan = require('../models/mealPlan');
const {protect} = require('../middleware/authMiddleware');
const mealPlanController = require('../controllers/mealPlanController');


const router = express.Router();

// POST /api/meals - Add a new meal
router.post('/', [
    body('mealName').isString().trim().notEmpty().withMessage('Meal name is required.'),
    body('mealCategory').isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack']).withMessage('Invalid meal category.'),
    body('calories').isFloat({ gt: 0 }).withMessage('Calories must be a positive number.'),
    body('protein').isFloat({ gt: 0 }).withMessage('Protein must be a positive number.'),
    body('fat').isFloat({ gt: 0 }).withMessage('Fat must be a positive number.'),
    body('carbohydrates').isFloat({ gt: 0 }).withMessage('Carbohydrates must be a positive number.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const mealData = req.body;

    try {
        const newMeal = await Meal.create(mealData);
        res.status(201).json(newMeal); // 201 Created
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving meal. Please try again.' });
    }
});

// GET /api/meals - Get all meals (or implement logic to fetch meals by category if provided)
router.get('/', async (req, res) => {
    const { category } = req.query; // Get category from query if provided

    try {
        const query = category ? { mealCategory: category } : {};
        // Include calories in the projection
        const meals = await Meal.find(query, 'mealName _id calories'); // Include calories in the response
        res.json(meals);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// POST /saveMeal - Save a meal plan for a specific day
router.post('/saveMealPlan', async (req, res) => {
    try {
        const { userId, day, meals } = req.body; // Get userId, day, and meals from the request

        if (!userId || !day || !meals) {
            return res.status(400).json({ message: 'User ID, day, and meals are required.' });
        }

        const mealPlan = new MealPlan({
            userId: userId,
            day: day,
            meals: meals
        });

        await mealPlan.save();

        res.status(200).json({ message: 'Meal plan saved successfully.', mealPlan });
    } catch (error) {
        console.error('Error saving meal plan:', error);
        res.status(500).json({ message: 'Server error. Unable to save meal plan.' });
    }
});


// Add this new route in mealRoutes.js
router.get('/user/:userId/mealPlans', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Assuming you have a MealPlan model
        const mealPlans = await MealPlan.find({ userId: userId }); // Adjust the query according to your schema
        if (!mealPlans.length) {
            return res.status(404).json({ message: 'No meal plans found for this user.' });
        }
        res.json(mealPlans);
    } catch (error) {
        console.error('Error fetching meal plans:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/meals/details/:mealId - Get a specific meal by ID
router.get('/details/:mealId', async (req, res) => {
    const mealId = req.params.mealId; // Extract mealId from the URL parameters

    try {
        const meal = await Meal.findById(mealId); // Fetch the meal from the database using the mealId
        if (!meal) {
            return res.status(404).json({ message: 'Meal not found' }); // Handle case where meal is not found
        }
        res.json(meal); // Return the meal details as a JSON response
    } catch (error) {
        console.error('Error fetching meal details:', error);
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
});

// POST /api/mealPlans - Save a meal plan for a specific day
router.post('/mealPlans', async (req, res) => {
    try {
        const { userId, day, meals } = req.body; // Get userId, day, and meals from the request

        if (!userId || !day || !meals) {
            return res.status(400).json({ message: 'User ID, day, and meals are required.' });
        }

        const mealPlan = new MealPlan({
            userId: userId,
            day: day,
            meals: meals
        });

        await mealPlan.save();

        res.status(201).json({ message: 'Meal plan saved successfully.', mealPlan });
    } catch (error) {
        console.error('Error saving meal plan:', error);
        res.status(500).json({ message: 'Server error. Unable to save meal plan.' });
    }
});

// PUT /api/meals/mealPlans/:id - Update a specific meal plan by ID
router.put('/mealPlans/:id', async (req, res) => {
    const mealPlanId = req.params.id;
    const { meals } = req.body; // Get the new meals from the request body

    if (!meals) {
        return res.status(400).json({ message: 'Meals are required.' });
    }

    try {
        const updatedMealPlan = await MealPlan.findByIdAndUpdate(
            mealPlanId,
            { meals: meals }, // Update the meals array
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedMealPlan) {
            return res.status(404).json({ message: 'Meal plan not found.' });
        }

        res.json({ message: 'Meal plan updated successfully.', updatedMealPlan });
    } catch (error) {
        console.error('Error updating meal plan:', error);
        res.status(500).json({ message: 'Server error. Unable to update meal plan.' });
    }
});

router.delete('/:id', mealPlanController.deleteMealPlan);
router.get('/chartData', protect, mealPlanController.getChartData);
router.get('/chartData/weekly', protect, mealPlanController.getWeeklyChartData);
router.get('/chartData/yearly', protect, mealPlanController.getYearlyChartData);






module.exports = router;
