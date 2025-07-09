// routes/config.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get current config
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM system_config LIMIT 1');
  if (rows.length > 0) {
    res.json(rows[0]);
  } else {
    // If not set, return sensible defaults
    res.json({
      emailVerification: true,
      selfRegistration: false,
      minPasswordLength: 8,
      sessionTimeout: 30,
      notif_email: true,
      notif_push: false,
      notif_weekly: true,
      notif_maintenance: true,
      maxStudents: 30,
      batchDuration: 6,
      batchTransfer: true,
      autoArchive: true,
      maxFileSize: 10,
      maxUsers: 1000,
      backup: "Daily"
    });
  }
});

// Update config
router.put('/', async (req, res) => {
  const config = req.body;
  await db.query('DELETE FROM system_config'); // Only one row
  await db.query('INSERT INTO system_config SET ?', [config]);
  res.json({ success: true });
});

module.exports = router;
