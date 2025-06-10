const { pool } = require('../config/database');

const createActivityLog = async ({ user_id, action_type, entity_type, entity_id, details }) => {
    try {
        await pool.query(
            `INSERT INTO activity_logs 
            (user_id, action_type, entity_type, entity_id, details) 
            VALUES (?, ?, ?, ?, ?)`,
            [user_id, action_type, entity_type, entity_id, JSON.stringify(details)]
        );
    } catch (error) {
        console.error('Error creating activity log:', error);
        // Don't throw error to prevent disrupting the main operation
    }
};

module.exports = {
    createActivityLog
}; 