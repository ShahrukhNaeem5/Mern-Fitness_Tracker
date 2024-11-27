const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userAccount',
        required: true
    },
    day: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    exercises: [
        {
            name: {
                type: String,
                required: true
            },
            sets: {
                type: Number,
                required: true,
                default: 3
            },
            reps: {
                type: Number,
                required: true,
                default: 0
            },
            duration: {
                type: Number,
                default: 0
            },
            additionalWeights: {
                type: Number,
                default: 0
            },
        }
    ],
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});
module.exports = mongoose.model('Workout', workoutSchema);
