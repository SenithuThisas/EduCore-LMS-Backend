const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/departments - Fetch all departments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT department_id, department_name FROM departments ORDER BY department_name'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
