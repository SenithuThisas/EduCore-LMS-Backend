const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/auth');
const {
  getAdminDashboard,
  getCoordinatorDashboard,
  getStudentDashboard
} = require('../controllers/dashboardController');

// Admin dashboard route
router.get('/admin', verifyToken, checkRole(['admin']), getAdminDashboard);

// Coordinator dashboard route
router.get('/coordinator', verifyToken, checkRole(['coordinator']), getCoordinatorDashboard);

// Student dashboard route
router.get('/student', verifyToken, checkRole(['student']), getStudentDashboard);

module.exports = router; 