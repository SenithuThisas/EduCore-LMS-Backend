const express = require('express');
const router = express.Router();
const db = require('../config/db');
const crypto = require('crypto');
const authenticate = require('../middleware/authenticate');

// Helper to generate a secure token
function generateSecureToken(payload) {
  // You can use JWT or a simple random string + DB record
  return crypto.randomBytes(32).toString('hex');
}

// 1. Create a QR attendance session (coordinator triggers this)
router.post('/session', async (req, res) => {
  const { batch, module, lecture, start } = req.body;
  const startTime = new Date(start);
  const expiry = new Date(startTime.getTime() + 20 * 60000); // 20 minutes after start
  const token = generateSecureToken({ batch, module, lecture, start, expiry });

  try {
    // Save the session to DB
    const [result] = await db.query(
      'INSERT INTO attendance_sessions (batch, module, lecture, start, expiry, token) VALUES (?, ?, ?, ?, ?, ?)',
      [batch, module, lecture, startTime, expiry, token]
    );
    const sessionId = result.insertId;

    // Return the QR URL (frontend will generate QR from this)
    res.json({
      qrUrl: `https://your-lms.com/attendance/mark?token=${token}`,
      sessionId,
      token,
      expiry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create attendance session' });
  }
});

// 2. Mark attendance (student scans QR and authenticates)
router.post('/mark', async (req, res) => {
  const { token } = req.query;
  // You should have authentication middleware to get req.user
  const userId = req.user?.id; // Adjust as per your auth system

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Find the session by token
    const [sessions] = await db.query('SELECT * FROM attendance_sessions WHERE token = ?', [token]);
    const session = sessions[0];
    if (!session) {
      return res.status(400).json({ error: 'Invalid or expired QR code.' });
    }

    // Check expiry
    if (new Date() > new Date(session.expiry)) {
      return res.status(400).json({ error: 'QR code expired.' });
    }

    // Check if already marked
    const [alreadyMarked] = await db.query(
      'SELECT * FROM attendance WHERE user_id = ? AND session_id = ?',
      [userId, session.id]
    );
    if (alreadyMarked.length > 0) {
      return res.status(200).json({ message: 'Attendance already marked.' });
    }

    // Mark attendance
    await db.query(
      'INSERT INTO attendance (user_id, session_id, marked_at) VALUES (?, ?, ?)',
      [userId, session.id, new Date()]
    );
    res.json({ message: 'Attendance marked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark attendance.' });
  }
});


// Protect this route: only authenticated users can mark attendance
router.post('/mark', authenticate, async (req, res) => {
  // Now req.user is available!
  const userId = req.user.id;
  // ...rest of your attendance marking logic
});

module.exports = router;
