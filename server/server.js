const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const { WebSocketServer } = require('ws');
const { consumer } = require('./kafka');
const authRoutes = require('./routes/authRoutes.js');
const taskRoutes = require('./routes/taskRoutes');
const { stripeWebhook} = require('./controllers/taskController');

require('dotenv').config();

const app = express();

// Set up CORS
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  credentials: true, // Allow cookies and other credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
app.post('/api/stripeWebhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// WebSocket server setup
const wss = new WebSocketServer({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
});

// Kafka consumer setup
const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'task-updates' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const updateData = JSON.parse(message.value.toString());
      // Broadcast the update to all connected WebSocket clients
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(updateData));
      });
    },
  });
};

runConsumer().catch(console.error);
