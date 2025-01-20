const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'task-management-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'task-updates-group' });
const admin = kafka.admin();

// Initialize Kafka setup
const initializeKafka = async () => {
  try {
    // Connect admin
    await admin.connect();
    
    // Create topic if it doesn't exist
    const topics = await admin.listTopics();
    if (!topics.includes('task-updates')) {
      await admin.createTopics({
        topics: [{
          topic: 'task-updates',
          numPartitions: 1,    // Number of partitions
          replicationFactor: 1 // Replication factor
        }]
      });
      console.log('Created task-updates topic');
    }
    await admin.disconnect();

    // Connect producer
    await producer.connect();
    console.log('Kafka producer connected');

  } catch (error) {
    console.error('Error initializing Kafka:', error);
  }
};

initializeKafka();

module.exports = {
  producer,
  consumer
}; 