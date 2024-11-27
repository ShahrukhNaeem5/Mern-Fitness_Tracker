import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import setnut from '../assets/img/banner/set-nut.jpg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SetNutrition = () => {
    const [userData, setUserData] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const mealPlanId = params.get('mealPlanId'); 

    const [dayName, setDayName] = useState('');
    const [meals, setMeals] = useState({
        breakfast: [{ food: '', quantity: 1 }],
        lunch: [{ food: '', quantity: 1 }],
        dinner: [{ food: '', quantity: 1 }]
    });
    const [foodOptions, setFoodOptions] = useState({
        breakfast: [],
        lunch: [],
        dinner: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch logged-in user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get('userData');

                if (!token) {
                    toast.error('No valid session found, please login again');
                    navigate('/');
                    return;
                }

                const response = await axios.get('http://localhost:4000/api/useraccount/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUserData(response.data);
            } catch (error) {
                toast.error('Failed to fetch user data');
                console.error(error);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Fetch Food Options
    useEffect(() => {
        const fetchFoodOptions = async () => {
            try {
                const breakfastResponse = await fetch('http://localhost:4000/api/meals?category=Breakfast');
                const lunchResponse = await fetch('http://localhost:4000/api/meals?category=Lunch');
                const dinnerResponse = await fetch('http://localhost:4000/api/meals?category=Dinner');

                if (!breakfastResponse.ok || !lunchResponse.ok || !dinnerResponse.ok) {
                    throw new Error('Failed to fetch food options');
                }

                const breakfastData = await breakfastResponse.json();
                const lunchData = await lunchResponse.json();
                const dinnerData = await dinnerResponse.json();

                setFoodOptions({
                    breakfast: breakfastData,
                    lunch: lunchData,
                    dinner: dinnerData
                });
            } catch (error) {
                console.error('Error fetching food options:', error);
                setError('Unable to load food options.');
            }
        };

        fetchFoodOptions();

        const query = new URLSearchParams(location.search);
        const day = query.get('day') || 'Unknown Day';
        setDayName(day);
    }, [location.search]);

    const createFoodSelection = (mealType) => {
        setMeals(prevMeals => ({
            ...prevMeals,
            [mealType]: [...prevMeals[mealType], { food: '', quantity: 1 }]
        }));
    };

    const removeFood = (mealType, index) => {
        setMeals(prevMeals => ({
            ...prevMeals,
            [mealType]: prevMeals[mealType].filter((_, i) => i !== index)
        }));
    };

    const handleChange = (mealType, index, value, field) => {
        setMeals(prevMeals => ({
            ...prevMeals,
            [mealType]: prevMeals[mealType].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const isFormValid = () => {
        return Object.values(meals).every(meal =>
            meal.every(item => item.food && item.quantity > 0)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!isFormValid()) {
            setError('Please ensure all fields are filled with valid values.');
            setLoading(false);
            return;
        }

        try {
            const formattedMeals = [];
            ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                meals[mealType].forEach(item => {
                    formattedMeals.push({ mealId: item.food, quantity: item.quantity });
                });
            });

            const requestData = {
                userId: userData._id,
                day: dayName,
                meals: formattedMeals
            };
            let response;

            if (mealPlanId) {
                response = await axios.put(`http://localhost:4000/api/meals/mealPlans/${mealPlanId}`, {
                    meals: formattedMeals
                });
            } else {
                response = await axios.post('http://localhost:4000/api/meals/mealPlans', requestData);
            }

            if (response && response.data) {
                toast.success(response.data.message);
                setSuccess(response.data.message);

                // Delay redirection
                setTimeout(() => {
                    navigate('/NutritionPlan');
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting meal plan:', error);
            setError('Failed to save meal plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderMealSelection = (mealType, items) => (
        <div className="meal-card">
            <h4>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
            <div id={`${mealType}Container`}>
                {items.map((item, index) => (
                    <div className="food-selection" key={index}>
                        <select
                            className="form-select d-inline me-2 meal-select"
                            value={item.food}
                            onChange={(e) =>
                                handleChange(mealType, index, e.target.value, 'food')
                            }
                            required
                        >
                            <option value="">Select Food</option>
                            {foodOptions[mealType]?.map(food => {
                                // Calculate the total calories if the current item is selected and has a quantity
                                const isSelected = item.food === food._id;
                                const totalCalories = isSelected
                                    ? food.calories * item.quantity
                                    : food.calories;
    
                                return (
                                    <option key={food._id} value={food._id}>
                                        {food.mealName} - {totalCalories} kcal
                                    </option>
                                );
                            })}
                        </select>
                        <input
                            type="number"
                            className="form-control qty-input"
                            min="1"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) =>
                                handleChange(mealType, index, e.target.value, 'quantity')
                            }
                            style={{ width: '70px' }}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-danger remove-food"
                            onClick={() => removeFood(mealType, index)}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                ))}
            </div>
            <button
                type="button"
                className="btn st-meal-btn btn-primary mb-2"
                onClick={() => createFoodSelection(mealType)}
            >
                Add Food
            </button>
        </div>
    );
    
    

    return (
        <div className="black-bg">
            <Navbar />
            <main>
                <section className="team-area fix">
                    <div className="container set-nt">
                        <div className="row">
                            <div className="col-md-8">
                                <h1 className="text-center">Set Meals for <span id="dayName">{dayName}</span></h1>

                                {error && <div className="alert alert-danger">{error}</div>}
                                {success && <div className="alert alert-success">{success}</div>}

                                <form onSubmit={handleSubmit} id="mealForm">
                                    {renderMealSelection('breakfast', meals.breakfast)}
                                    {renderMealSelection('lunch', meals.lunch)}
                                    {renderMealSelection('dinner', meals.dinner)}

                                    <button type="submit" className="btn btn-success p-4" disabled={loading}>
                                        {loading ? 'Saving...' : 'Submit Meals'}
                                    </button>
                                </form>
                            </div>

                            <div className="col-md-4 mt-5">
                                <div className="team-img setntimg">
                                    <img src={setnut} alt="Nutrition" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <ToastContainer />
            <Footer />
        </div>
    );
};

export default SetNutrition;
