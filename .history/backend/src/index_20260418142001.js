require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { mongoConnection, connectRedis } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { startAlertScheduler } = require('./services/alertScheduler');

// Routes
const authRoutes = require('./routes/auth');
const riskRoutes = require('./routes/risk');
const interventionRoutes = require('./routes/interventions');
const alertRoutes = require('./routes/alerts');
const coordinatorRoutes = require('./routes/coordinator');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/reports', reportRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await mongoConnection();
  await connectRedis();

  // Run seed on first start
  const User = require('./models/User');
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('🌱 Seeding database...');
    require('./scripts/seed');
  }

  // Start alert scheduler
  startAlertScheduler();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Open browser: http://localhost:3000`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
