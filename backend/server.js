// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");
const ConnectDB = require("./config/DB");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const workoutRoutes = require('./routes/workoutRoutes'); // Ensure this is 
const mealPlanRoutes = require('./routes/mealRoutes'); // Adjust the path according to your project structure
const otpRoutes = require('./routes/otp');
const app = express();

// Middleware to handle CORS - allowing the frontend to access the backend
app.use(cors({
    origin: 'http://localhost:3000',
}));


// Rate limiting middleware to prevent DDoS attacks
/* const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
});
app.use(limiter);
 */
// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for the 'upload' folder where images are stored
app.use('/upload', express.static(path.join(__dirname, '../frontend/src/upload')));

// Routes
app.use('/api/useraccount', require('./routes/userAccountRoutes'));
app.use('/api/useraccount/SignIn', require('./routes/signInRoutes'));
app.use('/api/useraccount', require('./routes/userProfileRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api', workoutRoutes); 
app.use('/api', mealPlanRoutes); 
app.use('/api', otpRoutes); // Use OTP routes
app.use('/api/workouts', workoutRoutes);



// Starting the server and connecting to the database
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    ConnectDB(); // Call to your database connection
    console.log(`Server is running on port ${PORT}`);
});
