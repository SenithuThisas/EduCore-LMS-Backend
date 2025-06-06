const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// ✅ Test route to check if routing works
router.get('/test', (req, res) => {
  res.send('✅ /api/auth/login is working');
});

router.post('/login', login);

module.exports = router;
