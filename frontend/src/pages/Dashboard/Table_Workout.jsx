import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Table_Workout = () => {
    const [workoutData, setWorkoutData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [filter, setFilter] = useState('weekly'); // Default filter set to weekly
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [bodyWeight, setBodyWeight] = useState(null); 

    const days = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], []);
    const months = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);
    const years = useMemo(() => Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - i), []); // Create an array for the last 7 years

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get('userData');
                if (!token) {
                    setError('User not authenticated');
                    toast.error('No valid session found, please login again');
                    navigate('/');
                    return;
                }

                const response = await axios.get('http://localhost:4000/api/useraccount/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserId(response.data._id);
                setBodyWeight(response.data.bodyWeight); 
            } catch (error) {
                setError('Failed to fetch user data');
                console.error(error);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (!userId) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:4000/api/workouts/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('userData')}`
                    }
                });

                const data = response.data;
                const organizedWorkouts = filter === 'weekly' ? {} : (filter === 'monthly' ? {} : {});

                if (filter === 'weekly') {
                    days.forEach(day => {
                        organizedWorkouts[day] = [];
                    });

                    data.forEach(workout => {
                        const day = workout.day;
                        if (organizedWorkouts[day]) {
                            organizedWorkouts[day].push(workout);
                        }
                    });
                } else if (filter === 'monthly') {
                    months.forEach(month => {
                        organizedWorkouts[month] = [];
                    });

                    data.forEach(workout => {
                        const workoutDate = new Date(workout.createdAt); // Assuming workout has a createdAt field
                        const month = workoutDate.toLocaleString('default', { month: 'long' });
                        if (organizedWorkouts[month]) {
                            organizedWorkouts[month].push(workout);
                        }
                    });
                } else if (filter === 'yearly') {
                    years.forEach(year => {
                        organizedWorkouts[year] = [];
                    });

                    data.forEach(workout => {
                        const workoutDate = new Date(workout.createdAt); // Assuming workout has a createdAt field
                        const year = workoutDate.getFullYear();
                        if (organizedWorkouts[year]) {
                            organizedWorkouts[year].push(workout);
                        }
                    });
                }

                setWorkoutData(organizedWorkouts);
            } catch (error) {
                console.error('Error fetching workouts:', error);
                setError('Error fetching workouts');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchWorkouts();
        }
    }, [userId, filter, days, months, years]);

    // Function to handle filter change
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const calculateCaloriesBurned = (exercise) => {
        {

            // Given variables from your exercise object
            const reps = exercise.reps;
            const sets = exercise.sets;
            const duration = exercise.duration;
            const additionalWeights = exercise.additionalWeights;
            const weight = 80;
            const met = 6;

            // Calculate total weight
            const totalWeight = weight + (additionalWeights || 0);

            // Calculate time per rep using total duration
            const totalReps = sets * reps;
            const timePerRep = duration / totalReps;
            const restTime = (sets - 1);
            const totalTime = (totalReps * timePerRep) + restTime;
            // Calculate calories burned using the provided formula
            const caloriesBurned = met * totalWeight * (totalTime / 60);

            return caloriesBurned.toFixed(2);
        }
    }
    const handleDeleteWorkout = async (workoutId) => {
        try {
            await axios.delete(`http://localhost:4000/api/workouts/${workoutId}`, {
                headers: { Authorization: `Bearer ${Cookies.get('userData')}` }
            });
            toast.success('Workout deleted successfully');

            // Remove deleted workout from state
            setWorkoutData((prevData) => {
                // Create a shallow copy of the current workoutData
                const updatedData = { ...prevData };

                // Loop through the keys (days, months, or years)
                for (const key in updatedData) {
                    // Filter out the workouts that contain the deleted workout ID
                    updatedData[key] = updatedData[key].filter(workout => workout._id !== workoutId);
                }
                return updatedData; // Return the updated data
            });
        } catch (error) {
            toast.error('Error deleting workout');
            console.error('Error deleting workout:', error);
        }
    };
    const filteredWorkouts = (workouts) => {
        return workouts.filter(workout => {
            const dateStr = new Date(workout.createdAt).toLocaleDateString();
            const termLower = searchTerm.toLowerCase();
            const matchesDate = dateStr.includes(termLower); // Check if date matches
            const matchesExercise = workout.exercises.some(ex => ex.name.toLowerCase().includes(termLower)); // Check if any exercise matches
            return matchesDate || matchesExercise; // Return true if either matches
        });
    };

    const calculateTotalCalories = () => {
        let totalCalories = 0;

        // Loop through workout data to calculate totals based on the filter
        (filter === 'weekly' ? days : filter === 'monthly' ? months : years).forEach((label) => {
            const workoutsForPeriod = workoutData[label] || [];
            workoutsForPeriod.forEach(workout => {
                workout.exercises.forEach(exercise => {
                    totalCalories += parseFloat(calculateCaloriesBurned(exercise));
                });
            });
        });

        return totalCalories;
    };

    const generatePDF = () => {
        const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation

        // Title
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0); // Set text color to black
        pdf.text('Workout Report', 14, 20);

        // Prepare the columns based on the filter
        const headers = [
            filter === 'weekly' ? 'Day' : filter === 'monthly' ? 'Month' : 'Year',
            'Exercise Name',
            'Reps',
            'Sets',
            'Duration',
            'Additional Weight',
            'Calories Burned',
            'Note',
            filter === 'weekly' ? 'Date (MM-DD-YYYY)' : 'Date'
        ];

        // Prepare the data for the table
        const tableData = [];
        const periods = filter === 'weekly' ? days : filter === 'monthly' ? months : years;

        periods.forEach((label) => {
            const workoutsForPeriod = workoutData[label] || [];
            if (workoutsForPeriod.length === 0) {
                // Add an entry for periods with no data
                tableData.push([
                    label,
                    '---',
                    '---',
                    '---',
                    '---',
                    '---',
                    '0',
                    '---',
                    filter === 'weekly' ? '---' : '---'
                ]);
            } else {
                workoutsForPeriod.forEach(workout => {
                    workout.exercises.forEach(exercise => {
                        tableData.push([
                            label,
                            exercise.name,
                            exercise.reps,
                            exercise.sets,
                            exercise.duration,
                            exercise.additionalWeights,
                            calculateCaloriesBurned(exercise),
                            workout.note,
                            filter === 'weekly' ? new Date(workout.createdAt).toLocaleDateString() : new Date(workout.createdAt).toLocaleDateString()
                        ]);
                    });
                });
            }
        });

        // Use autotable to add the table
        pdf.autoTable({
            head: [headers],
            body: tableData,
            startY: 30, // Start position for the table
            theme: 'grid', // You can choose 'striped', 'grid', 'plain'
            styles: { cellPadding: 3, fontSize: 10 },
            headStyles: { fillColor: [0, 0, 0] }, // Header background color
            alternateRowStyles: { fillColor: [220, 220, 220] }, // Alternating row color
        });

        // Calculate total calories
        const totalCalories = calculateTotalCalories();

        // Add total calories to the PDF
        pdf.setFontSize(12);
        pdf.text(`Total Calories: ${totalCalories.toFixed(2)}`, 14, pdf.autoTable.previous.finalY + 10);

        // Save the PDF
        pdf.save('workout-report.pdf');
    };




    return (
        <>
            <div className="container-fluid pt-4 px-4">
                <div className="bg-secondary text-center rounded p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h6 className="mb-0">Workout Plan</h6>
                        <div className="ms-auto d-flex"> {/* Ensure this div is in place to align the dropdown */}
                            <input
                                className='form-control mx-2 mb-3'
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search workout or date..."
                            />
                            <select
                                onChange={handleFilterChange}
                                value={filter}
                                className="form-select"
                                style={{ width: 'auto' }} // You can set a specific width if needed
                            >
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            <button className="btnpdf btn-primary ms-2" onClick={generatePDF}>Download PDF</button>
                        </div>
                    </div>
                    <div className="table-responsive" id="workout-table">
                        <table className="table table-view text-start align-middle table-bordered border-white table-hover mb-0">
                            <thead>
                                <tr className="text-white">
                                    <th scope="col">{filter === 'weekly' ? 'Day' : filter === 'monthly' ? 'Month' : 'Year'}</th>
                                    <th scope="col">Exercise Name</th>
                                    <th scope="col">Reps</th>
                                    <th scope="col">Sets</th>
                                    <th scope="col">Duration</th>
                                    <th scope="col">Additional Weight</th>
                                    <th scope="col">Calories Burned</th>
                                    <th scope="col">Note</th>
                                    {filter === 'weekly' && <th scope="col">Date<br />
                                        <span className='dateformat'>(MM-DD-YYYY)</span></th>}
                                    <th scope="col">{filter === 'weekly' ? 'Action' : 'Date'}</th>
                                </tr>
                            </thead>
                            <tbody className='nutrition-data-table'>
                                {(filter === 'weekly' ? days : filter === 'monthly' ? months : years).map((label, index) => {
                                    const workoutsForPeriod = filteredWorkouts(workoutData[label] || []);
                                    return (
                                        <React.Fragment key={index}>
                                            {workoutsForPeriod.length > 0 ? (
                                                workoutsForPeriod.map((workout, workoutIndex) => (
                                                    workout.exercises.map((exercise, exerciseIndex) => (
                                                        <tr key={`${label}-${exerciseIndex}`}>
                                                            {exerciseIndex === 0 && workoutIndex === 0 && (
                                                                <td className='fw-bold border-white' rowSpan={workoutsForPeriod.reduce((acc, w) => acc + w.exercises.length, 0)}>
                                                                    {label}
                                                                </td>
                                                            )}
                                                            <td>{exercise.name}</td>
                                                            <td>{exercise.reps}</td>
                                                            <td>{exercise.sets}</td>
                                                            <td>{exercise.duration}</td>
                                                            <td>{exercise.additionalWeights}</td>
                                                            <td>{calculateCaloriesBurned(exercise)}</td>
                                                            {exerciseIndex === 0 && workoutIndex === 0 && (
                                                                <td className='fw-bold border-white' rowSpan={workoutsForPeriod.reduce((total, workout) => total + workout.exercises.length, 0)}>
                                                                    {workout.note}
                                                                </td>
                                                            )}
                                                            {filter === 'weekly' && (
                                                                <td><td>

                                                                    {(() => {
                                                                        const date = new Date(workout.createdAt);
                                                                        const day = String(date.getDate()).padStart(2, '0');
                                                                        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                                                                        const year = date.getFullYear();
                                                                        return `${month}/${day}/${year}`;
                                                                    })()}

                                                                </td>
                                                                </td> // Separate Date column for weekly
                                                            )}
                                                            {exerciseIndex === 0 && (
                                                                <td className='fw-bold border-white' rowSpan={workout.exercises.length}>
                                                                    {filter !== 'weekly' ? (
                                                                        <td>
                                                                            {(() => {
                                                                                const date = new Date(workout.createdAt);
                                                                                const day = String(date.getDate()).padStart(2, '0');
                                                                                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                                                                                const year = date.getFullYear();
                                                                                return `${month}/${day}/${year}`;
                                                                            })()}
                                                                        </td>

                                                                        // Date for monthly/yearly
                                                                    ) : (
                                                                        <>
                                                                            <Link to={`/SetWorkoutPlan?id=${workout._id}&day=${label}`} className="btn btn-danger  fixed-button">
                                                                                Update
                                                                            </Link>
                                                                            <br />
                                                                            <br />
                                                                            <Link onClick={() => handleDeleteWorkout(workout._id)} className="btn btn-danger  fixed-button">
                                                                                Delete
                                                                            </Link>
                                                                        </>
                                                                    )}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))
                                                ))
                                            ) : (
                                                <tr key={label}>
                                                    <td className='fw-bold'>{label}</td>
                                                    <td colSpan={filter === 'weekly' ? 8 : 8}></td>
                                                    {filter === 'weekly' && (
                                                        <td>
                                                            <Link to={`/SetWorkoutPlan?day=${label}`} className="btn btn-primary">
                                                                Set
                                                            </Link>
                                                        </td>
                                                    )}
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
            <ToastContainer />
        </>
    );
};

export default Table_Workout;
