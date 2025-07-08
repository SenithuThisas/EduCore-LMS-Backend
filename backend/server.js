const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db'); // ✅ MySQL DB connection
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminDashRoutes = require('./routes/adminDash');
const studentsRoutes = require('./routes/students');
const coordinatorsRoutes = require('./routes/coordinators');

const app = express();

// -------------------- Middleware --------------------

// Enable CORS with specific origin and credentials
app.use(cors({
  origin: 'http://localhost:3000', // <-- Your frontend's URL
  credentials: true                // <-- Allow cookies/auth headers
}));

// Parse incoming JSON requests
app.use(express.json());

// -------------------- Routes --------------------

// Health check route (optional but useful for testing)
app.get('/', (req, res) => {
  res.send('✅ LMS Backend API is running...');
});

// Auth routes (e.g., /api/auth/login)
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes mounted at /api/auth');

// Dashboard routes (e.g., /api/dashboard)
app.use('/api/dashboard', dashboardRoutes);

// Admin Dash routes (e.g., /api/adminDash)
app.use('/api', adminDashRoutes);

// Students routes (e.g., /api/students)
app.use('/api/students', studentsRoutes);
console.log('✅ Students routes mounted at /api/students');

// Coordinators routes (e.g., /api/coordinators)
app.use('/api/coordinators', coordinatorsRoutes);
console.log('✅ Coordinators routes mounted at /api/coordinators');

const batchesRoutes = require('./routes/batches');
app.use('/api', batchesRoutes);

// -------------------- 404 Handler --------------------

// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// -------------------- Global Error Handler --------------------

// Catches any server-side errors not handled above
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '❗ Internal server error' });
});

// -------------------- Server Startup --------------------

const PORT = process.env.PORT || 3460; // Make sure this matches your running port!
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
