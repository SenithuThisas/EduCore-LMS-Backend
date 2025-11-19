const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/batches - Returns all courses and their batches
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.course_name, b.batch_id, b.batch_name
      FROM courses c
      JOIN batches b ON c.course_id = b.course_id
      ORDER BY c.course_name, b.batch_name
    `);

    // Group batches by course
    const courseBatchMap = {};
    rows.forEach(row => {
      if (!courseBatchMap[row.course_name]) courseBatchMap[row.course_name] = [];
      courseBatchMap[row.course_name].push({ batch_id: row.batch_id, batch_name: row.batch_name });
    });

    res.json(courseBatchMap);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
