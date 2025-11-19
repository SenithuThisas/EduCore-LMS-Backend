const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/auth');
const { adminMiddleware } = require('../middlewares/admin');

// Apply authentication middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard routes
router.get('/overview', adminController.getDashboardOverview);
router.get('/recent-activity', adminController.getRecentActivity);

// System configuration routes
router.get('/config', adminController.getSystemConfig);
router.put('/config', adminController.updateSystemConfig);

// Reports routes
router.get('/reports', adminController.getReports);

// Audit logs route
router.get('/logs', adminController.getAuditLogs);

module.exports = router; 
