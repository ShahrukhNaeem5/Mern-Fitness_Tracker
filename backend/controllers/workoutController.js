// workoutController.js
const Workout = require('../models/workoutPlan');

exports.saveWorkout = async (req, res) => {
    const { userId, day, note, exercises } = req.body;

    if (!userId || !day || !exercises || exercises.length === 0) {
        return res.status(400).json({ message: 'User ID, day, and exercises are required.' });
    }

    try {
        const workout = new Workout({ userId, day, note,exercises });
        await workout.save();
        return res.status(201).json({ message: 'Workout saved successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save workout', error });
    }
};

exports.getWorkoutsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const workouts = await Workout.find({ userId }).populate('userId');
        return res.status(200).json(workouts);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch workouts', error });
    }
};

exports.getWorkoutByUserAndDay = async (req, res) => {
    const { userId, day } = req.params;
    try {
        const workout = await Workout.findOne({ userId, day });
        if (!workout) {
            return res.status(404).json({ message: 'No workout found for the given user and day.' });
        }
        return res.status(200).json(workout);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch workout', error });
    }
};

// Update workout by ID
exports.updateWorkoutById = async (req, res) => {
    const { id } = req.params;
    const { exercises, note,day, userId } = req.body;

    try {
        const updatedWorkout = await Workout.findByIdAndUpdate(
            id,
            { exercises, note, day, userId },
            { new: true, runValidators: true }
        );

        if (!updatedWorkout) {
            return res.status(404).json({ message: 'Workout plan not found' });
        }

        res.status(200).json({ message: 'Workout plan updated successfully', updatedWorkout });
    } catch (error) {
        res.status(500).json({ message: 'Error updating workout plan', error });
    }
};

exports.deleteWorkout = async (req, res) => {
    const { id } = req.params;

    try {
        const workout = await Workout.findByIdAndDelete(id);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Error deleting workout:', error);
        res.status(500).json({ message: 'Error deleting workout' });
    }
};