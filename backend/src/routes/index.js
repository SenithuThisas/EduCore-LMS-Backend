const express = require('express');

const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const adminDashRoutes = require('./adminDash');
const studentsRoutes = require('./students');
const coordinatorsRoutes = require('./coordinators');
const batchesRoutes = require('./batches');
const coursesRoutes = require('./courses');
const coordinatorDashRoutes = require('./coordinatorDash');
const attendanceRoutes = require('./attendance');
const assignmentsRoutes = require('./assignments');
const departmentRoutes = require('./department');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/adminDash', adminDashRoutes);
router.use('/students', studentsRoutes);
router.use('/coordinators', coordinatorsRoutes);
router.use('/batches', batchesRoutes);
router.use('/courses', coursesRoutes);
router.use('/coordinatorDash', coordinatorDashRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/assignments', assignmentsRoutes);
router.use('/departments', departmentRoutes);

module.exports = router;
