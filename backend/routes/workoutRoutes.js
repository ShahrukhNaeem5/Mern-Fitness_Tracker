// workoutRoutes.js
const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// Route to save a new workout
router.post('/saveRoutine', workoutController.saveWorkout);

// Route to get workouts by user ID
router.get('/workouts/:userId', workoutController.getWorkoutsByUserId);

// Route to get a specific workout by user ID and day
router.get('/workout/:userId/:day', workoutController.getWorkoutByUserAndDay);

// Route to update workout plan by ID
router.put('/workout/:id', workoutController.updateWorkoutById);
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router;
