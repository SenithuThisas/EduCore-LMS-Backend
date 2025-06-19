const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db'); // ✅ MySQL DB connection
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminDashRoutes = require('./routes/adminDash');




const app = express();

// -------------------- Middleware --------------------


app.use('/api', adminDashRoutes); // Register the route with the '/api' prefix

// Enable CORS to allow requests from frontend (e.g., React)
app.use(cors());

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

// Dashboard routes (e.g., /api/dashboard/adminDash)
app.use('/api/dashboard', dashboardRoutes);



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

const PORT = process.env.PORT || 3458;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
