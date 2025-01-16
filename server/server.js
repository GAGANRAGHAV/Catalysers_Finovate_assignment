const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const authRoutes = require('./routes/authRoutes.js');
const taskRoutes = require('./routes/taskRoutes');
const { stripeWebhook} = require('./controllers/taskController');

require('dotenv').config();

const app = express();

// Set up CORS
app.use(cors({
  origin: 'https://catalysers-finovate-assignment.vercel.app', // Replace with your frontend's origin
  credentials: true, // Allow cookies and other credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
app.post('/api/stripeWebhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
