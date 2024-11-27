require('dotenv').config(); // Load environment variables
const mongoose = require("mongoose");
const colors = require('colors');

const ConnectDB = async () => {
    try {
        // Construct the MongoDB URI using env variables
        const username = encodeURIComponent(process.env.MONGO_USERNAME);
        const password = encodeURIComponent(process.env.MONGO_PASSWORD);
        const cluster = process.env.MONGO_CLUSTER;
        const dbName = process.env.MONGO_DBNAME;
        const appName = process.env.MONGO_APPNAME;

        // Ensure that all parts of the URI are present
        if (!username || !password || !cluster || !dbName) {
            throw new Error("Missing required environment variables for MongoDB connection");
        }

        const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=${appName}`;

        // Connect to MongoDB using Mongoose
        const conn = await mongoose.connect(uri);

        console.log(`Server is connected to the database: ${conn.connection.db.databaseName}`.cyan.underline);
    } catch (error) {
        console.error("Database connection error: ", error);
    }
}

module.exports = ConnectDB;
