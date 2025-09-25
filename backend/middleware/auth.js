const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { has: isBlacklisted } = require('../utils/tokenBlacklist');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Check if token is blacklisted
        if (isBlacklisted(token)) {
            return res.status(401).json({ message: 'Token has been logged out' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const [users] = await pool.query(
            'SELECT id, username, email, role_id, status FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!users.length) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = users[0];

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(401).json({ message: 'User account is not active' });
        }

        // Attach user to request object
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

module.exports = {
    authMiddleware
}; 