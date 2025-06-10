const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = async (req, res) => {
  console.log('🔐 /api/auth/login route was hit');

  try {
    const { username, email, password } = req.body; // Expect plain password from client

    // Input validation
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required!' });
    }

    // Get user from database
    const [users] = await db.query(
      'SELECT user_id, username, email, password_hash, role, created_at FROM users WHERE username = ? OR email = ?',
      [username || email, username || email]
    );
    
    const user = users[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Plain text password comparison (not secure for production)
    if (password !== user.password_hash) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    // Generate JWT token with VARCHAR user_id
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Response with user_id
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
