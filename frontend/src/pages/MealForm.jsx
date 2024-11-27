import React, { useState } from 'react';
import axios from 'axios'; // For sending data to backend
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MealForm = () => {
    const [mealName, setMealName] = useState('');
    const [mealCategory, setMealCategory] = useState('Breakfast');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbohydrates, setCarbohydrates] = useState('');
    const [quantity, setQuantity] = useState('');

    const toastMessage = (message, type) => {
        if (type === 'error') {
            toast.error(message, { position: 'top-right' });
        } else {
            toast.success(message, { position: 'top-right' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input
        const isValid = mealName && calories && protein && fat && carbohydrates;
        if (!isValid) {
            toastMessage('Please fill out all fields', 'error');
            return;
        }

        const mealData = {
            mealName: mealName.trim(),  // Trim to remove whitespace
            mealCategory,
            calories: parseFloat(calories),
            protein: parseFloat(protein),
            fat: parseFloat(fat),
            carbohydrates: parseFloat(carbohydrates),
            quantity: parseFloat(quantity),
        };

        try {
            const response = await axios.post('http://localhost:4000/api/meals', mealData, {
                headers: {
                    'Content-Type': 'application/json', // Explicitly set content type
                },
            });
            if (response.status === 201) { // Check for successful creation
                toastMessage('Meal saved successfully!', 'success');
                // Clear form fields
                setMealName('');
                setMealCategory('');
                setCalories('');
                setProtein('');
                setFat('');
                setCarbohydrates('');
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            toastMessage('Error saving meal. Please try again.', 'error');
        }
    };
    return (
        
        <div className="meal-form-bg-color">
            <h2>Log a New Meal</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="mealName" className="form-label">Meal Name</label>
                    <input
                        type="text"
                        id="mealName"
                        className="form-control"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        placeholder="Enter meal name"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="mealCategory" className="form-label">Meal Category</label>
                    <select
                        id="mealCategory"
                        className="form-control"
                        value={mealCategory}
                        onChange={(e) => setMealCategory(e.target.value)}
                    >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snack">Snack</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="calories" className="form-label">Calories</label>
                    <input
                        type="number"
                        id="calories"
                        className="form-control"
                        value={calories}
                        step="0.1"  // Allow increments of 0.1
                        min={0}
                        onChange={(e) => setCalories(e.target.value)}
                        placeholder="Enter total calories"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="protein" className="form-label">Protein (g)</label>
                    <input
                        type="number"
                        id="protein"
                        className="form-control"
                        value={protein}
                        step="0.1"  // Allow increments of 0.1
                        min={0}
                        onChange={(e) => setProtein(e.target.value)}
                        placeholder="Enter protein in grams"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="fat" className="form-label">Fat (g)</label>
                    <input
                        type="number"
                        id="fat"
                        className="form-control"
                        value={fat}
                        step="0.1"  // Allow increments of 0.1
                        min={0}
                        onChange={(e) => setFat(e.target.value)}
                        placeholder="Enter fat in grams"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="carbohydrates" className="form-label">Carbohydrates (g)</label>
                    <input
                        type="number"
                        id="carbohydrates"
                        className="form-control"
                        value={carbohydrates}
                        step="0.1"  // Allow increments of 0.1
                        min={0}
                        onChange={(e) => setCarbohydrates(e.target.value)}
                        placeholder="Enter carbohydrates in grams"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Save Meal</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default MealForm;