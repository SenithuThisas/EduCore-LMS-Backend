const { pool } = require('../config/database');

const adminMiddleware = async (req, res, next) => {
    try {
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    adminMiddleware
}; 