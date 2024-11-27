import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TotalCal = () => {
    const [totals, setTotals] = useState({ calories: 0, protein: 0, fat: 0, carbohydrates: 0 });
    const [loading, setLoading] = useState(true);
    const [monthName, setMonthName] = useState('');

    useEffect(() => {
        // Get the current month name
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        setMonthName(currentMonth);

        const fetchMonthlyTotals = async () => {
            const token = Cookies.get('userData');
            if (!token) {
                toast.error('No valid session found, please login again');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:4000/api/useraccount/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { _id: userId } = response.data;

                // Fetch meal plans for the current month
                const mealResponse = await axios.get(`http://localhost:4000/api/meals/user/${userId}/mealPlans?filter=monthly`);
                const mealPlans = mealResponse.data;

                // Initialize nutrient totals
                let totalCalories = 0;
                let totalProtein = 0;
                let totalFat = 0;
                let totalCarbohydrates = 0;

                // Calculate totals for each meal plan
                for (const mealPlan of mealPlans) {
                    const { meals } = mealPlan;

                    for (const meal of meals) {
                        const mealDetailResponse = await axios.get(`http://localhost:4000/api/meals/details/${meal.mealId}`);
                        const mealDetails = mealDetailResponse.data;

                        totalCalories += (mealDetails.calories || 0) * (meal.quantity || 1);
                        totalProtein += (mealDetails.protein || 0) * (meal.quantity || 1);
                        totalFat += (mealDetails.fat || 0) * (meal.quantity || 1);
                        totalCarbohydrates += (mealDetails.carbohydrates || 0) * (meal.quantity || 1);
                    }
                }

                setTotals({ calories: totalCalories, protein: totalProtein, fat: totalFat, carbohydrates: totalCarbohydrates });
            } catch (error) {
                console.error('Error fetching meal plans:', error);
                toast.info('Unable to fetch meal plans for this month.');
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyTotals();
    }, []);

    return (
        <>
            <div className="container-fluid total-cal pt-4 px-4">
                <div className="row g-4">
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-line fa-3x text-primary"></i>
                            <div className="ms-3 text-white">
                                <p className="mb-2">Total Calories of {monthName}</p>
                                <h6 className="mb-0">{loading ? 'Loading...' : totals.calories}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-bar fa-3x text-primary"></i>
                            <div className="ms-3">
                                <p className="mb-2">Total Protein of {monthName}</p>
                                <h6 className="mb-0">{loading ? 'Loading...' : totals.protein}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-area fa-3x text-primary"></i>
                            <div className="ms-3">
                                <p className="mb-2">Total Fat of {monthName}</p>
                                <h6 className="mb-0">{loading ? 'Loading...' : totals.fat}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-pie fa-3x text-primary"></i>
                            <div className="ms-3">
                                <p className="mb-2">Total Carb of {monthName}</p>
                                <h6 className="mb-0">{loading ? 'Loading...' : totals.carbohydrates}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TotalCal;
