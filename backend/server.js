const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db'); // ✅ Test DB connection here
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8878;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
