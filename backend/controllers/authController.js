const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = async (req, res) => {
  console.log('🔐 /api/auth/login route was hit');

  try {
    const { username, email, password } = req.body;

    // Input validations
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required!' });
    }
    

    // Get user from database using either username or email
    let query = 'SELECT * FROM users WHERE username = ? OR email = ?';
    let params = [username || email, username || email];
    
    const [users] = await db.query(query, params);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Simple password comparison
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Successful response
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at_timestamp
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