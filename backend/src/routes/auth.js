const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { add: blacklistToken } = require('../utils/tokenBlacklist');
const { authMiddleware } = require('../middlewares/auth');

// ✅ Test route to check if routing works
router.get('/test', (req, res) => {
  res.send('✅ /api/auth/login is working');
});

router.post('/login', login);
router.post('/logout', authMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    blacklistToken(token);
  }
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
