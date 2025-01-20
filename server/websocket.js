const { consumer } = require('./kafka.js');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

(async () => {
  try {
    await consumer.connect();
    console.log("Kafka consumer connected");

    await consumer.subscribe({ topic: 'task-updates', fromBeginning: false });

    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const taskUpdate = JSON.parse(message.value.toString());
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(taskUpdate));
            }
          });
        } catch (err) {
          console.error('Error processing Kafka message:', err);
        }
      },
    });
  } catch (err) {
    console.error('Error connecting Kafka consumer:', err);
  }
})();
