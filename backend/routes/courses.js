const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/courses — fetch all courses
router.get('/', async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

module.exports = router;
