// controllers/mealPlanController.js
const MealPlan = require('../models/mealPlan'); // Adjust the path according to your project structure
const moment = require('moment'); // Use moment.js for date handling

exports.getChartData = async (req, res) => {
    const userId = req.user._id;

    try {
        const mealPlans = await MealPlan.find({ userId }).populate('meals.mealId');

        if (!mealPlans.length) {
            return res.status(404).json({ error: 'No meal data found for user ID: ' + userId });
        }

        const chartData = {
            labels: [],
            datasets: [{
                label: 'Calories',
                data: []
            }]
        };

        mealPlans.forEach(plan => {
            plan.meals.forEach(meal => {
                const mealName = meal.mealId.mealName;
                const calories = meal.mealId.calories * meal.quantity;

                if (!chartData.labels.includes(mealName)) {
                    chartData.labels.push(mealName);
                }

                const index = chartData.labels.indexOf(mealName);
                if (index !== -1) {
                    if (chartData.datasets[0].data[index]) {
                        chartData.datasets[0].data[index] += calories;
                    } else {
                        chartData.datasets[0].data[index] = calories;
                    }
                }
            });
        });

        res.json(chartData);
    } catch (error) {
        console.error('Error fetching meal data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getWeeklyChartData = async (req, res) => {

    console.log('Weekly Chart Data route hit'); // Log when the route is hit
    const userId = req.user._id;
    console.log('Weekly Chart Data function called for user ID:', userId); // Log when the function is called

    try {
        // Get the start and end dates for the current week
        const startDate = moment().startOf('week').toDate();
        const endDate = moment().endOf('week').toDate();
        console.log(`Fetching meal plans from ${startDate} to ${endDate}`); // Log the date range

        // Fetch meal plans for the week within the date range
        const mealPlans = await MealPlan.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        }).populate('meals.mealId');

        console.log('Meal plans fetched:', mealPlans); // Log meal plans data fetched

        if (!mealPlans.length) {
            console.log('No meal data found for the user ID:', userId); // Log if no meal plans are found
            return res.status(404).json({ error: 'No meal data found for user ID: ' + userId });
        }

        // Prepare chart data for each day of the week
        const chartData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [{
                label: 'Calories',
                data: Array(7).fill(0) // Initialize with 0 for each day of the week
            }]
        };

        // Iterate through meal plans to accumulate calories for each day
        mealPlans.forEach(plan => {
            const dayName = plan.day; // Use 'day' from the meal plan
            const dayIndex = chartData.labels.indexOf(dayName); // Get index for the day

            console.log(`Processing meals for: ${dayName}`); // Log the current day being processed

            // Check if the day is valid
            if (dayIndex !== -1) {
                plan.meals.forEach(meal => {
                    const calories = meal.mealId.calories * meal.quantity; // Calculate total calories
                    console.log(`Meal: ${meal.mealId.mealName}, Calories: ${calories}, Quantity: ${meal.quantity}`);

                    // Sum calories for the correct day
                    chartData.datasets[0].data[dayIndex] += calories;
                    console.log(`Total calories for ${dayName}: ${chartData.datasets[0].data[dayIndex]}`);
                });
            } else {
                console.error(`Day not found in labels: ${dayName}`);
            }
        });

        // Return the final chart data
        console.log('Final chart data:', chartData); // Log the final chart data
        console.log('Request received for weekly chart data');

        res.json(chartData);
    } catch (error) {
        console.error('Error fetching weekly meal data:', error); // Log the error if caught
        return res.status(500).json({ error: 'Internal server error' });
    }
};






exports.getYearlyChartData = async (req, res) => {
    const userId = req.user._id;

    try {
        const startDate = moment().startOf('year').toDate();
        const endDate = moment().endOf('year').toDate();
        const mealPlans = await MealPlan.find({ userId, date: { $gte: startDate, $lte: endDate } }).populate('meals.mealId');

        if (!mealPlans.length) {
            return res.status(404).json({ error: 'No meal data found for user ID: ' + userId });
        }

        const chartData = {
            labels: [],
            datasets: [{
                label: 'Calories',
                data: []
            }]
        };

        mealPlans.forEach(plan => {
            plan.meals.forEach(meal => {
                const mealName = meal.mealId.mealName;
                const calories = meal.mealId.calories * meal.quantity;

                if (!chartData.labels.includes(mealName)) {
                    chartData.labels.push(mealName);
                }

                const index = chartData.labels.indexOf(mealName);
                if (index !== -1) {
                    if (chartData.datasets[0].data[index]) {
                        chartData.datasets[0].data[index] ;
                    } else {
                        chartData.datasets[0].data[index] = calories;
                    }
                }
            });
        });

        res.json(chartData);
    } catch (error) {
        console.error('Error fetching yearly meal data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


exports.deleteMealPlan = async (req, res) => {
    const { id } = req.params;

    try {
        const mealPlan = await MealPlan.findByIdAndDelete(id);
        if (!mealPlan) {
            return res.status(404).json({ message: 'MealPlan not found' });
        }
        res.status(200).json({ message: 'MealPlan deleted successfully' });
    } catch (error) {
        console.error('Error deleting MealPlan:', error);
        res.status(500).json({ message: 'Error deleting MealPlan' });
    }
};



