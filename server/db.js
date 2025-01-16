const { Pool } = require('pg');
require('dotenv').config();

// Create a Pool instance to manage multiple clients
const pool = new Pool({
    user: 'taskmanagement_ni9v_user', // your username
    host: 'dpg-cu4a3h52ng1s738e5ldg-a', // or your database host
    database: 'taskmanagement_ni9v',
    password: '2vqdR5ebjLTz2E6LzhvkKZSEJjdJ122L', // your password
    port: 5432, // default PostgreSQL port
});

// Test the connection


// Export the pool to use in other parts of the app
module.exports = {
    pool
};
