const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/adminDash', async (req, res) => {
  try {
    const [students] = await db.query('SELECT COUNT(*) AS total FROM students');
    // const [batches] = await db.query('SELECT COUNT(*) AS total FROM batches WHERE status="active"');
    const [coordinators] = await db.query('SELECT COUNT(*) AS total FROM users WHERE role="Coordinator"');
    console.log(students);
    res.json({
      totalStudents: students[0].total,
    //   activeBatches: batches[0].total,
      coordinators: coordinators[0].total
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
