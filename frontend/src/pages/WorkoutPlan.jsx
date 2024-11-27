import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import aboutpic from "../assets/img/gallery/about.png";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const WorkoutPlan = () => {
    const [workoutData, setWorkoutData] = useState({});
    const [error, setError] = useState(null); // State to store error
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const days = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], []);

    // First useEffect to fetch user data and check authentication
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get('userData');

                if (!token) {
                    setError('User not authenticated'); // Set error when token is missing
                    toast.error('No valid session found, please login again');
                    navigate('/');
                    return;
                }

                const response = await axios.get('http://localhost:4000/api/useraccount/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUserId(response.data._id); // Store user ID for workout data
            } catch (error) {
                setError('Failed to fetch user data');
                console.error(error);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Second useEffect to fetch workout data
    useEffect(() => {
        const fetchWorkouts = async () => {
            if (!userId) {
                setError('User not authenticated'); // Show error if user ID is not set
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
                const organizedWorkouts = {};
                days.forEach(day => {
                    organizedWorkouts[day] = [];
                });

                // Organize workout data by day
                data.forEach(workout => {
                    const day = workout.day; // Ensure this matches your data model
                    if (organizedWorkouts[day]) {
                        organizedWorkouts[day].push({
                            id: workout._id,
                            note: workout.note,
                            exercises: workout.exercises,
                        });
                    }
                });

                setWorkoutData(organizedWorkouts); // Store organized workout data
                if (data.length > 0) {
                    toast.success('Workout Plans fetched successfully!'); // Show toast success
                } else {
                    toast.info('There are no workout plans.'); // Inform the user if no workouts were found
                }
            } catch (error) {
                setError('Error fetching workouts');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchWorkouts(); // Only fetch workouts if the user ID is available
        }
    }, [days, userId]);

    return (
        <div className="black-bg">
            <Navbar />
            <ToastContainer />
            <main>
                {loading && <p>Loading workouts...</p>}
                {error && <div className="alert alert-danger">{error}</div>} {/* Display error */}

                <section className="team-area fix mt-5">
                    <div className="container n-table">
                        <table className="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">Day</th>
                                    <th scope="col">Exercise Name</th>
                                    <th scope="col">Reps</th>
                                    <th scope="col">Sets</th>
                                    <th scope="col">Duration</th>
                                    <th scope="col">Additional Weight</th>
                                    <th scope="col">Note</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody className='nutrition-data-table'>
                                {days.map((day) => {
                                    const workoutsForDay = workoutData[day] || [];
                                    const hasData = workoutsForDay.length > 0;

                                    return (
                                        <React.Fragment key={day}>
                                            {hasData ? (
                                                workoutsForDay.map((workout, workoutIndex) => (
                                                    workout.exercises.map((exercise, exerciseIndex) => (
                                                        <tr key={`${day}-${workoutIndex}-${exerciseIndex}`}>
                                                            {exerciseIndex === 0 && workoutIndex === 0 && (
                                                                <td className='fw-bold border' rowSpan={workoutsForDay.reduce((total, workout) => total + workout.exercises.length, 0)}>
                                                                    {day}
                                                                </td>
                                                            )}

                                                            <td>{exercise.name}</td>
                                                            <td>{exercise.reps}</td>
                                                            <td>{exercise.sets}</td>
                                                            <td>{exercise.duration}</td> {/* New Column Data */}
                                                            <td>{exercise.additionalWeights}</td> {/* New Column Data */}
                                                            {exerciseIndex === 0 && workoutIndex === 0 && (
                                                                <td className='fw-bold border' rowSpan={workoutsForDay.reduce((total, workout) => total + workout.exercises.length, 0)}>
                                                                    {workout.note}
                                                                </td>
                                                            )}
                                                            {exerciseIndex === 0 && workoutIndex === 0 && (
                                                                <td className='fw-bold border' rowSpan={workoutsForDay.reduce((total, workout) => total + workout.exercises.length, 0)}>
                                                                    <Link to={`/SetWorkoutPlan?id=${workout.id}&day=${day}`}
                                                                        className="btn btn-danger fixed-button">
                                                                        Update
                                                                    </Link>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className='fw-bold'>{day}</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>
                                                        <Link to={`/SetWorkoutPlan?day=${day}`}
                                                            className="btn btn-danger fixed-button">
                                                            Set
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="about-area2 pb-padding pt-50 pb-80">
                    <div className="support-wrapper align-items-center">
                        <div className="right-content2">
                            <div className="right-img wow fadeInUp" data-wow-duration="1s" data-wow-delay=".1s">
                                <img src={aboutpic} alt="" />
                            </div>
                        </div>
                        <div className="left-content2">
                            <div className="section-tittle2 mb-20 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                                <div className="front-text">
                                    <h2>About Me</h2>
                                    <p>Learn about my fitness journey and how I can help you achieve your fitness goals.</p>
                                    <p className="mb-40">Whether you're looking for workout plans, nutrition tips, or motivation, I'm here to guide you.</p>
                                    <Link className="border-btn">My Courses</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
            <div id="back-top">
                <Link title="Go to Top"> <i className="fas fa-level-up-alt"></i></Link>
            </div>
        </div>
    );
};

export default WorkoutPlan;
