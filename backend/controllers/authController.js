const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Login controller
const login = async (req, res) => {

  console.log('🔐 /api/auth/login route was hit');
// ceff9376bc886c1ec7801a4eb52e18d7fa56b1a0
  try {
    const { username, email, password } = req.body;

    // Input validation
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required!' });
    }

    // Fetch user by username or email
    const [users] = await db.query(
      'SELECT user_id, username, email, password_hash, role, created_at FROM users WHERE username = ? OR email = ?',
      [username || email, username || email]
    );
    const user = users[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    // Generate JWT token with minimal payload
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1min' } // Shorter expiry for security
    );

    // Respond with user info and token
    res.json({
      message: 'Login successful!',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

module.exports = {
  login
};
