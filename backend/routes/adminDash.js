const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/adminDash
router.get('/adminDash', async (req, res) => {
  try {
    // Total number of students
    const [students] = await db.query('SELECT COUNT(*) AS total FROM students');
    // Total number of batches
    const [batches] = await db.query('SELECT COUNT(*) AS total FROM batches');
    // Total number of coordinators
    const [coordinators] = await db.query('SELECT COUNT(*) AS total FROM users WHERE role="Coordinator"');
    // All batches for breakdown
    const [batchRows] = await db.query('SELECT batch_id, batch_name FROM batches');
    // Student count per batch
    const [batchCountsRows] = await db.query('SELECT batch_id, COUNT(*) AS studentCount FROM student_batches GROUP BY batch_id');

    // Prepare batches array (list of batch IDs)
    const batchesArr = batchRows.map(row => row.batch_id);
    // Prepare batchCounts object (batch_id: studentCount)
    const batchCounts = {};
    batchCountsRows.forEach(row => {
      batchCounts[row.batch_id] = row.studentCount;
    });

    res.json({
      totalStudents: students[0].total,
      activeBatches: batches[0].total,
      coordinators: coordinators[0].total,
      batches: batchesArr,
      batchCounts: batchCounts
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
