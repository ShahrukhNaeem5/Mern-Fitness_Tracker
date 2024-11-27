import React, { useEffect, useState, useMemo } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Table_Nutrition = () => {
    const [mealData, setMealData] = useState({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('weekly'); // Default filter set to weekly
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const navigate = useNavigate();
    const days = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], []);
    const months = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);
    const years = useMemo(() => Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - i), []);

    useEffect(() => {
        const fetchMealPlans = async () => {
            const token = Cookies.get('userData');

            if (!token) {
                toast.error('No valid session found, please login again');
                navigate('/');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:4000/api/useraccount/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { _id: userId } = response.data;
                const mealResponse = await axios.get(`http://localhost:4000/api/meals/user/${userId}/mealPlans?filter=${filter}`);
                const mealPlans = mealResponse.data;

                const organizedMealData = {};
                for (const mealPlan of mealPlans) {
                    const { day, meals, _id: mealPlanId, date } = mealPlan;

                    let periodKey;
                    if (filter === 'weekly') {
                        periodKey = day; // Use day for weekly
                    } else if (filter === 'monthly') {
                        const month = new Date(date).toLocaleString('default', { month: 'long' }); // Extract month name
                        periodKey = month;
                    } else {
                        const year = new Date(date).getFullYear(); // Extract year
                        periodKey = year;
                    }

                    // Initialize the periodKey if it doesn't exist
                    if (!organizedMealData[periodKey]) {
                        organizedMealData[periodKey] = { mealPlanIds: [], meals: [], dates: [] }; // Store mealPlanIds and dates
                    }

                    // Add the mealPlanId and date to the period's array
                    organizedMealData[periodKey].mealPlanIds.push(mealPlanId);
                    organizedMealData[periodKey].dates.push(date); // Store multiple dates if necessary

                    const mealDetails = await Promise.all(
                        meals.map(async (meal) => {
                            const mealDetailResponse = await axios.get(`http://localhost:4000/api/meals/details/${meal.mealId}`);
                            return {
                                ...meal,
                                name: mealDetailResponse.data.mealName || 'Unknown',
                                category: mealDetailResponse.data.mealCategory || 'Unknown',
                                calories: mealDetailResponse.data.calories || 0,
                                protein: mealDetailResponse.data.protein || 0,
                                fat: mealDetailResponse.data.fat || 0,
                                carbohydrates: mealDetailResponse.data.carbohydrates || 0,
                                quantity: meal.quantity || 1,
                            };
                        })
                    );

                    organizedMealData[periodKey].meals = organizedMealData[periodKey].meals.concat(mealDetails);
                }

                setMealData(organizedMealData);
            } catch (error) {
                console.error('Error fetching meal plans:', error);
                toast.info('There are no meal plans.');
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlans();
    }, [navigate, filter]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const sumNutrients = (meals, nutrient) => {
        return meals.reduce((acc, meal) => acc + meal[nutrient] * meal.quantity, 0);
    };

    // Filter meals by search query for both meal name and date
    // In the filteredMealData logic
const filteredMealData = Object.keys(mealData).reduce((acc, periodKey) => {
    const mealForPeriod = mealData[periodKey];

    if (!mealForPeriod) {
        return acc; // Skip if mealForPeriod is undefined
    }

    const matchingMeals = mealForPeriod.meals.filter((meal) =>
        meal.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchingDates = mealForPeriod.dates.filter((date) => {
        const formattedDate = new Date(date).toLocaleDateString('en-US');
        return formattedDate.includes(searchQuery);
    });

    if (matchingMeals.length > 0 || matchingDates.length > 0) {
        acc[periodKey] = { ...mealForPeriod, meals: mealForPeriod.meals }; // Include all meals for that period
    }

    return acc;
}, {});



    const handleDeleteWorkout = async (mealPlanId) => {
        try {
            await axios.delete(`http://localhost:4000/api/meals/${mealPlanId}`, {
                headers: { Authorization: `Bearer ${Cookies.get('userData')}` }
            });
            toast.success('Meal Plan deleted successfully');
            window.location.reload();
            // Remove deleted meal plan from state
            setMealData((prevData) => {
                const updatedData = { ...prevData };
                for (const key in updatedData) {
                    // Filter out the meal plan that matches the mealPlanId
                    if (updatedData[key].mealPlanId === mealPlanId) {
                        delete updatedData[key]; // Remove the entire meal plan
                    }
                }
                return updatedData; // Return the updated data
            });
        } catch (error) {
            toast.error('Error deleting meal plan');
            console.error('Error deleting meal plan:', error);
        }
    };

    const calculateTotals = () => {
        let totalCalories = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalCarbohydrates = 0;

        // Loop through meal data based on the filter
        (filter === 'weekly' ? days : filter === 'monthly' ? months : years).forEach((label) => {
            const mealForPeriod = mealData[label] || {};
            const meals = mealForPeriod.meals || [];
            totalCalories += sumNutrients(meals, 'calories');
            totalProtein += sumNutrients(meals, 'protein');
            totalFat += sumNutrients(meals, 'fat');
            totalCarbohydrates += sumNutrients(meals, 'carbohydrates');
        });

        return {
            totalCalories,
            totalProtein,
            totalFat,
            totalCarbohydrates,
        };
    };

    const generatePDF = () => {
        // Change page size to A3
        const pdf = new jsPDF('l', 'mm', 'a3'); // Landscape orientation
    
        // Title
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0); // Set text color to black
        pdf.text('Nutrition Report', 14, 20);
    
        // Prepare the columns based on the filter
        const headers = [
            filter === 'weekly' ? 'Day' : filter === 'monthly' ? 'Month' : 'Year',
            'Breakfast',
            'Lunch',
            'Dinner',
            'Calories',
            'Protein',
            'Fat',
            'Carbohydrates',
            'Date (MM/DD/YYYY)',
        ];
    
        // Prepare the data for the table
        const tableData = [];
        (filter === 'weekly' ? days : filter === 'monthly' ? months : years).forEach((label) => {
            const mealForPeriod = mealData[label] || {};
            const meals = mealForPeriod.meals || [];
    
            // Initialize separate arrays for meals
            const breakfastMeals = [];
            const lunchMeals = [];
            const dinnerMeals = [];
    
            // Sort meals into categories
            meals.forEach((meal) => {
                if (meal.category === 'Breakfast') {
                    breakfastMeals.push(meal);
                } else if (meal.category === 'Lunch') {
                    lunchMeals.push(meal);
                } else if (meal.category === 'Dinner') {
                    dinnerMeals.push(meal);
                }
            });
    
            // Format dates properly
            const formattedDates = mealForPeriod.dates ? mealForPeriod.dates.map(date => new Date(date).toLocaleDateString('en-US')).join(', ') : '';
    
            tableData.push([
                label,
                breakfastMeals.map(meal => `${meal.name} x ${meal.quantity}`).join(', ') || '---',
                lunchMeals.map(meal => `${meal.name} x ${meal.quantity}`).join(', ') || '---',
                dinnerMeals.map(meal => `${meal.name} x ${meal.quantity}`).join(', ') || '---',
                sumNutrients(meals, 'calories'),
                sumNutrients(meals, 'protein'),
                sumNutrients(meals, 'fat'),
                sumNutrients(meals, 'carbohydrates'),
                formattedDates,
            ]);
        });
    
        // Use autotable to add the table
        pdf.autoTable({
            head: [headers],
            body: tableData,
            startY: 30,
            theme: 'grid',
            styles: { cellPadding: 3, fontSize: 10 },
            headStyles: { fillColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [220, 220, 220] },
        });
    
        // Calculate total nutrients
        const totals = calculateTotals();
    
        // Add total nutrients to the PDF
        pdf.setFontSize(12);
        pdf.text(`Total Calories Gain: ${totals.totalCalories.toFixed(2)}`, 14, pdf.autoTable.previous.finalY + 10);
        pdf.text(`Total Protein Gain: ${totals.totalProtein.toFixed(2)}`, 14, pdf.autoTable.previous.finalY + 15);
        pdf.text(`Total Fat Gain: ${totals.totalFat.toFixed(2)}`, 14, pdf.autoTable.previous.finalY + 20);
        pdf.text(`Total Carbohydrates Gain: ${totals.totalCarbohydrates.toFixed(2)}`, 14, pdf.autoTable.previous.finalY + 25);
    
        // Save the PDF
        pdf.save('nutrition-report.pdf');
    };
    
    


    return (
        <div className="container-fluid pt-4 px-4">
            <div className="bg-secondary text-center rounded p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h6 className="mb-0">Meal Plan</h6>
                    <div className="ms-auto d-flex">
                        <input
                            type="text"
                            placeholder="Search meals or date..."
                            className="form-control mx-2 mb-3"
                            style={{ width: '200px' }}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <select
                            onChange={handleFilterChange}
                            value={filter}
                            className="form-select"
                            style={{ width: 'auto' }}
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>

                        <button className="btnpdf btn-primary ms-2" onClick={generatePDF}>Download PDF</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-view text-start align-middle table-bordered border-white table-hover mb-0">
                        <thead>
                            <tr className="text-white">
                                <th scope="col">{filter === 'weekly' ? 'Day' : filter === 'monthly' ? 'Month' : 'Year'}</th>
                                <th scope="col">Breakfast</th>
                                <th scope="col">Lunch</th>
                                <th scope="col">Dinner</th>
                                <th scope="col">Calories</th>
                                <th scope="col">Protein</th>
                                <th scope="col">Fat</th>
                                <th scope="col">Carb</th>
                                <th scope="col">Date<br />
                                    <span className='dateformat'>(MM-DD-YYYY)</span>
                                </th>
                                {filter !== 'monthly' && filter !== 'yearly' && <th scope="col">Action</th>}
                            </tr>
                        </thead>
                        {!loading && (
                             <tbody>
                             {(filter === 'weekly' ? days : filter === 'monthly' ? months : years).map((label) => {
                                 const mealForPeriod = filteredMealData[label] || {};
                                 const meals = mealForPeriod.meals || [];

                                 const breakfastMeals = meals.filter(meal => meal.category === 'Breakfast');
                                 const lunchMeals = meals.filter(meal => meal.category === 'Lunch');
                                 const dinnerMeals = meals.filter(meal => meal.category === 'Dinner');

                                 return (
                                     <tr key={label}>
                                         <td className='fw-bold'>{label}</td>
                                         <td>{breakfastMeals.length > 0 ? breakfastMeals.map((meal, index) => (
                                             <div key={index} className="meal-item">
                                                 {meal.name} x {meal.quantity}
                                             </div>
                                         )) : '---'}</td>
                                         <td>{lunchMeals.length > 0 ? lunchMeals.map((meal, index) => (
                                             <div key={index} className="meal-item">
                                                 {meal.name} x {meal.quantity}
                                             </div>
                                         )) : '---'}</td>
                                         <td>{dinnerMeals.length > 0 ? dinnerMeals.map((meal, index) => (
                                             <div key={index} className="meal-item">
                                                 {meal.name} x {meal.quantity}
                                             </div>
                                         )) : '---'}</td>
                                         <td>{sumNutrients(meals, 'calories')}</td>
                                         <td>{sumNutrients(meals, 'protein')}</td>
                                         <td>{sumNutrients(meals, 'fat')}</td>
                                         <td>{sumNutrients(meals, 'carbohydrates')}</td>
                                         <td>{mealForPeriod.dates && mealForPeriod.dates.map(date => new Date(date).toLocaleDateString('en-US')).join(',')}</td>
                                         {filter !== 'monthly' && filter !== 'yearly' && (
                                             <td>
                                                 {meals.length > 0 ? (
                                                     <>
                                                         <Link to={`/SetNutrition?id=${mealForPeriod.mealPlanIds[0]}&day=${label}`} className="btn btn-danger">
                                                             Update
                                                         </Link>
                                                         <br />
                                                         <Link onClick={() => handleDeleteWorkout(mealForPeriod.mealPlanIds[0])} className="btn btn-danger">
                                                             Delete
                                                         </Link>
                                                     </>
                                                 ) : (
                                                     <Link to={`/SetNutrition?day=${label}`} className="btn btn-primary">
                                                         Set
                                                     </Link>
                                                 )}
                                             </td>
                                         )}
                                     </tr>
                                 );
                             })}
                         </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Table_Nutrition;
