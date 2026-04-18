const mongoose = require('mongoose');
const redis = require('redis');

const mongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
  }
};

module.exports = { mongoConnection, redisClient, connectRedis };
