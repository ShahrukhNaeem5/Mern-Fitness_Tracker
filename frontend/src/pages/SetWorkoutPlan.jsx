import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

function SetWorkoutPlan() {
    const [category, setCategory] = useState('strength');
    const [note, setNote] = useState(''); 
    const [exercises, setExercises] = useState([]);
    const [dayName, setDayName] = useState('');
    const [userId, setUserId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); // Flag to handle update mode
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const workoutPlanId = params.get('id');

    // Fetch user data (such as userId) when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get('userData');

                if (!token) {
                    toast.error('No valid session found, please login again');
                    navigate('/');
                    return;
                }
                // Get user profile data from API
                const response = await axios.get('http://localhost:4000/api/useraccount/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUserId(response.data._id);
            } catch (error) {
                toast.error('Failed to fetch user data');
                console.error(error);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Fetch day name from URL parameters if available
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const day = query.get('day');
        if (day) setDayName(day);
    }, [location]);

    // Fetch the workout data if the workoutPlanId is provided
    useEffect(() => {
        if (workoutPlanId && userId) {
            const fetchWorkoutData = async () => {
                try {
                    const response = await axios.get(`http://localhost:4000/api/workout/${userId}/${dayName}`);
                    if (response.data) {
                        const workout = response.data;
                        setCategory(workout.category || 'strength');
                        setExercises(workout.exercises || []);
                        setNote(workout.note || '');
                        setIsUpdating(true); // Switch to update mode
                    }
                } catch (error) {
                    console.error('Error fetching workout data:', error);
                    toast.error('Failed to load workout data');
                }
            };

            fetchWorkoutData();
        }
    }, [workoutPlanId, userId, dayName]);

    const addExercise = () => {
        setExercises([...exercises, { name: '', reps: '', sets: '', duration: '', additionalWeights: '', note: '' }]);
    };

    const removeExercise = (index) => {
        const newExercises = exercises.filter((_, i) => i !== index);
        setExercises(newExercises);
    };

    const handleExerciseChange = (index, field, value) => {
        const updatedExercises = exercises.map((exercise, i) =>
            i === index ? { ...exercise, [field]: value } : exercise
        );
        setExercises(updatedExercises);
    };

    const saveRoutine = async (event) => {
        event.preventDefault();
        const token = Cookies.get('userData');

        if (!userId) {
            toast.error('User ID not found. Please log in again.', { autoClose: 1500 });
            return;
        }

        if (exercises.length === 0) {
            toast.error('At least one exercise is required.', { autoClose: 1500 });
            return;
        }

        const formattedExercises = exercises.map(ex => ({
            name: ex.name,
            sets: parseInt(ex.sets, 10) || 3,
            reps: parseInt(ex.reps, 10) || 0,
            duration: parseInt(ex.duration, 10) || 0,
            additionalWeights: parseInt(ex.additionalWeights, 10) || 0

        }));

        for (const exercise of formattedExercises) {
            if (!exercise.name || exercise.reps <= 0 || exercise.sets <= 0) {
                toast.error('Please fill out all exercise fields correctly.', { autoClose: 1500 });
                return;
            }
        }

        const routineData = {
            userId,
            day: dayName,
            category,
            note, 
            exercises: formattedExercises,
        };

        try {
            if (isUpdating) {
                // Update existing workout plan
                await axios.put(`http://localhost:4000/api/workout/${workoutPlanId}`, routineData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                toast.success('Workout routine updated successfully!');
            } else {
                // Save new workout plan
                await axios.post('http://localhost:4000/api/saveRoutine', routineData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                toast.success('Workout routine saved successfully!');
            }

            setTimeout(() => {
                navigate('/WorkoutPlan');
            }, 1500);
        } catch (error) {
            console.error('Error saving/updating workout:', error.response ? error.response.data : error.message);
            toast.error('Failed to save or update the workout routine. Please try again.', { autoClose: 1500 });
        }
    };

    return (
        <div className="black-bg">
            <Navbar />
            <ToastContainer />
            <main>
                <div className="set-gym mt-4">
                    <section className="team-area">
                        <div className="container">
                            <h1>Workout Routine Manager <span id="dayName">{dayName}</span></h1>
                            <form onSubmit={saveRoutine}>
                                <h3>Exercises</h3>
                                <div id="exerciseList">
                                    {exercises.map((exercise, index) => (
                                        <div className="exercise-item" key={index}>
                                            <input
                                                type="text"
                                                placeholder="Exercise Name"
                                                value={exercise.name}
                                                onChange={(e) =>
                                                    handleExerciseChange(index, 'name', e.target.value)
                                                }
                                            />
                                            <input
                                                type="number"
                                                placeholder="Reps"
                                                value={exercise.reps}
                                                min="1"
                                                onChange={(e) =>
                                                    handleExerciseChange(index, 'reps', e.target.value)
                                                }
                                            />
                                            <input
                                                type="number"
                                                placeholder="Sets"
                                                value={exercise.sets}
                                                min="1"
                                                onChange={(e) =>
                                                    handleExerciseChange(index, 'sets', e.target.value)
                                                }
                                            />
                                            <input
                                                type="number"
                                                placeholder="Duration (minutes)"
                                                value={exercise.duration}
                                                min="1"
                                                onChange={(e) =>
                                                    handleExerciseChange(index, 'duration', e.target.value)
                                                }
                                            />
                                            <input
                                                type="number"
                                                placeholder="Additional Weights"
                                                value={exercise.additionalWeights}
                                                min="1"
                                                onChange={(e) =>
                                                    handleExerciseChange(index, 'additionalWeights', e.target.value)
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="remove-exercise"
                                                onClick={() => removeExercise(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" id="addExerciseBtn" onClick={addExercise}>
                                    Add Exercise
                                </button>

                                <label htmlFor="category">Category:</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="strength">Strength</option>
                                    <option value="cardio">Cardio</option>
                                    <option value="flexibility">Flexibility</option>
                                </select>

                                <label htmlFor="tags">Notes:</label>
                                <input
                                    type="text"
                                    id="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="e.g., beginner, HIIT"
                                />

                                <button type="submit">{isUpdating ? 'Update Routine' : 'Save Routine'}</button>
                            </form>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default SetWorkoutPlan;
