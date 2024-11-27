import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

const SaleRevenue = () => {
  const [userId, setUserId] = useState(null);
  const [workoutData, setWorkoutData] = useState([]);
  const [filter, setFilter] = useState('weekly');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('userData');
        if (!token) {
          throw new Error('User not authenticated');
        }

        const response = await axios.get('http://localhost:4000/api/useraccount/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(response.data._id);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch workout data from API
  useEffect(() => {
    const fetchWorkoutData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:4000/api/workouts/${userId}`);
          setWorkoutData(response.data || []);
        } catch (err) {
          setError('Failed to load workout data. Please try again later.');
          toast.error('Failed to load workout data.');
        }
      }
    };

    fetchWorkoutData();
  }, [userId]);

  // Calculate total duration for the given workouts
  const calculateTotalDuration = (exercises) => {
    return exercises.reduce((total, exercise) => total + (exercise.duration || 0), 0);
  };

  // Effect to format the chart data based on the workout data and filter
  useEffect(() => {
    const formatChartData = () => {
      if (workoutData.length === 0) {
        setChartData({
          labels: ['No Data'],
          datasets: [
            {
              label: 'Total Duration (minutes)',
              data: [0],
              backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color to indicate no data
            },
          ],
        });
        return;
      }

      let labels = [];
      let data = [];

      if (filter === 'weekly') {
        labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        data = labels.map((day) => {
          const workoutsForDay = workoutData.filter((workout) => workout.day === day);
          return workoutsForDay.reduce((total, workout) => total + calculateTotalDuration(workout.exercises), 0);
        });
      } else if (filter === 'monthly') {
        labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        data = labels.map((month) => {
          const workoutsForMonth = workoutData.filter((workout) => {
            return new Date(workout.createdAt).toLocaleString('default', { month: 'long' }) === month;
          });
          return workoutsForMonth.reduce((total, workout) => total + calculateTotalDuration(workout.exercises), 0);
        });
      } else if (filter === 'yearly') {
        const currentYear = new Date().getFullYear();
        labels = Array.from({ length: 6 }, (_, i) => currentYear - i); // Last 6 years
        data = labels.map((year) => {
          const workoutsForYear = workoutData.filter((workout) => 
            new Date(workout.createdAt).getFullYear() === year
          );
          return workoutsForYear.reduce((total, workout) => total + calculateTotalDuration(workout.exercises), 0);
        });
      }

      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Duration (minutes)',
            data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
        ],
      });
    };

    formatChartData();
  }, [workoutData, filter]);

  return (
    <div className="col-sm-12 col-xl-6 mb-3">
      <ToastContainer />
      {error && <p className="text-danger">{error}</p>}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h6 className="mb-0">Workout Overview</h6>
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="bg-secondary text-center rounded p-4">
        <Bar data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default SaleRevenue;
