const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { has: isBlacklisted } = require('../utils/tokenBlacklist');

const getTokenFromRequest = (req) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) {
    return null;
  }

  if (header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }

  return header;
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    if (isBlacklisted(token)) {
      return res.status(401).json({ message: 'Token has been logged out' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.query(
      'SELECT id, username, email, role, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!users.length) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = users[0];

    if (user.status && user.status !== 'active') {
      return res.status(401).json({ message: 'User account is not active' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    next(error);
  }
};

const verifyToken = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: 'No user found!' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Requires specific role!' });
  }

  next();
};

module.exports = {
  authMiddleware,
  verifyToken,
  checkRole
};
