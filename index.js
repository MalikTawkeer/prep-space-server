require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Root Route
app.get('/', (req, res) => {
  res.json({
    status: 'Server is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      userSignUp: 'POST /api/auth/user/signup',
      userSignIn: 'POST /api/auth/user/signin',
      adminSignIn: 'POST /api/auth/admin/signin',
      profile: 'GET /api/auth/profile',
    },
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
