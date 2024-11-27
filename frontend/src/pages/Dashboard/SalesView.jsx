import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SalesView = () => {
    const [mealViewPeriod, setMealViewPeriod] = useState('weekly');
    const [mealData, setMealData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const token = Cookies.get('userData');
            if (!token) {
                setError('User not authenticated');
                toast.error('No valid session found, please login again');
                navigate('/');
                return null;
            }

            const response = await axios.get('http://localhost:4000/api/useraccount/profile', {
                headers: { Authorization: `Bearer ${token}` },
                
            });
            console.log(token);

            console.log('Fetched User Data:', response.data);
            return response.data._id;
        } catch (error) {
            setError('Failed to fetch user data');
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    const fetchMealData = async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const token = Cookies.get('userData');
    
            const response = await axios.get(
                `http://localhost:4000/api/meals/chartData?period=${mealViewPeriod}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            console.log('API Response:', response.data);
    
            const { datasets } = response.data;
    
            // Initialize empty arrays for labels and values
            let labels = [];
            let values = [];
    
            // Determine the labels based on the selected period
            switch (mealViewPeriod) {
                case 'daily':
                    labels = ['Breakfast', 'Lunch', 'Dinner'];
                    values = [
                        datasets[0]?.data[0] || 0,
                        datasets[0]?.data[1] || 0,
                        datasets[0]?.data[2] || 0,
                    ];
                    break;
                case 'weekly':
                    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    
                    // Create an array to hold values for each day of the week
                    values = new Array(7).fill(0); // Initialize with zeros
    
                    // Loop through meals and populate values based on the day of the week
                    datasets.forEach((dataset) => {
                        dataset.data.forEach((value, index) => {
                            // Here we assume dataset contains data for each day in order
                            // You'll need to modify this according to how your data is structured
                            const dayIndex = Math.floor(index / 3); // Assuming 3 meals per day
                            if (dayIndex < labels.length) {
                                values[dayIndex] += value; // Add to the respective day
                            }
                        });
                    });
                    break;
                case 'yearly':
                    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    // Implement yearly data logic if applicable
                    break;
                default:
                    labels = response.data.labels; // Default case for other periods
            }
    
            if (values.length === 0) {
                setError('No meal data available');
                toast.error('No meal data available');
                return;
            }
    
            // Set the meal data state
            setMealData({
                labels: labels,
                datasets: [{
                    label: 'Calories', // Example label
                    data: values, // Values calculated above
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            });
        } catch (error) {
            console.error(
                'Error fetching meal data:',
                error.response ? error.response.data : error.message
            );
            /* setError('Failed to load meal data'); */
            toast.error('Failed to load meal data');
        } finally {
            setLoading(false);
        }
    };
    
    
    
    
    

    useEffect(() => {
        const loadData = async () => {
            try {
                const userId = await fetchUserData();
                if (userId) {
                    console.log('Fetched User ID:', userId);
                    await fetchMealData(userId);
                }
            } catch (error) {
                console.error('Error during data loading:', error);
            }
        };

        loadData();
    }, [mealViewPeriod]);

    if (loading) {
        return <div>Loading meal data...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error: {error}</div>;
    }

    const chartData = {
        labels: mealData.labels.length > 0 ? mealData.labels : ['No Data'],
        datasets: mealData.datasets.length > 0
            ? mealData.datasets.map((dataset) => ({
                ...dataset,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }))
            : [],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                title: { display: true, text: 'Category / Time Period' },
            },
            y: {
                title: { display: true, text: 'Nutritional Value (e.g., Calories)' },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                },
            },
        },
    };

    return (
        <div className="col-sm-12 col-xl-6 mb-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h5>Meal Data Overview</h5>
                <select
                    className="form-select w-auto"
                    onChange={(e) => setMealViewPeriod(e.target.value)}
                    value={mealViewPeriod}
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            <div className="bg-secondary text-center rounded p-4">
                <Bar data={chartData} options={chartOptions} />
            </div>

            {mealData.labels.length === 0 && <div>No data available for the selected period.</div>}
        </div>
    );
};

export default SalesView;
