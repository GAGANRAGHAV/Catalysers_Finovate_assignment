const { Pool } = require('pg');
require('dotenv').config();

// Create a Pool instance to manage multiple clients
const pool = new Pool({
    user: 'postgres', // your username
    host: 'localhost', // or your database host
    database: 'taskmanagement',
    password: 'postgres', // your password
    port: 5432, // default PostgreSQL port
});

// Test the connection


// Export the pool to use in other parts of the app
module.exports = {
    pool
};
