const jwt = require('jsonwebtoken');

// Replace with your real secret!
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticate(req, res, next) {
  // Get token from Authorization header: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token error' });
  }

  const token = parts[1];

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    // Attach user info to request
    req.user = decoded;
    next();
  });
}

module.exports = authenticate;
