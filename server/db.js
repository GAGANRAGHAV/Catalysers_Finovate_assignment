const { Pool } = require('pg');

// Create a Pool instance to manage database connections
const pool = new Pool({
  user: 'taskmanagement_ni9v_user',
  host: 'dpg-cu4a3h52ng1s738e5ldg-a.oregon-postgres.render.com',
  database: 'taskmanagement_ni9v',
  password: '2vqdR5ebjLTz2E6LzhvkKZSEJjdJ122L',
  port: 5432,
  ssl: { rejectUnauthorized: false }, // Required for Render-hosted PostgreSQL
});

// Test the connection
pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Database connection error:', err.stack));

// Export the pool for use in other parts of the app
module.exports = pool;
