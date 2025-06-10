// const { pool } = require('../config/database');
// const { createActivityLog } = require('../utils/activityLogger');

// class AdminController {
//     // Get dashboard overview
//     async getDashboardOverview(req, res, next) {
//         try {
//             const [stats] = await pool.query(`
//                 SELECT 
//                     (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
//                     (SELECT COUNT(*) FROM batches) as total_batches,
//                     (SELECT COUNT(*) FROM users WHERE role = 'coordinator') as total_coordinators,
//                     (SELECT COUNT(*) FROM courses) as total_courses
//             `);

//             // Get percentage changes from last month
//             const [lastMonthStats] = await pool.query(`
//                 SELECT 
//                     (SELECT COUNT(*) FROM users WHERE role = 'student' AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as last_month_students,
//                     (SELECT COUNT(*) FROM batches WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as last_month_batches,
//                     (SELECT COUNT(*) FROM users WHERE role = 'coordinator' AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as last_month_coordinators,
//                     (SELECT COUNT(*) FROM courses WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as last_month_courses
//             `);

//             // Calculate percentage changes
//             const percentageChanges = {
//                 students: calculatePercentageChange(stats[0].total_students, lastMonthStats[0].last_month_students),
//                 batches: calculatePercentageChange(stats[0].total_batches, lastMonthStats[0].last_month_batches),
//                 coordinators: calculatePercentageChange(stats[0].total_coordinators, lastMonthStats[0].last_month_coordinators),
//                 courses: calculatePercentageChange(stats[0].total_courses, lastMonthStats[0].last_month_courses)
//             };

//             res.json({
//                 current_stats: stats[0],
//                 percentage_changes: percentageChanges
//             });
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Get recent activity
//     async getRecentActivity(req, res, next) {
//         try {
//             const [activities] = await pool.query(`
//                 SELECT 
//                     al.*,
//                     u.username,
//                     u.first_name,
//                     u.last_name
//                 FROM activity_logs al
//                 LEFT JOIN users u ON al.user_id = u.id
//                 ORDER BY al.created_at DESC
//                 LIMIT 50
//             `);

//             res.json(activities);
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Get system configuration
//     async getSystemConfig(req, res, next) {
//         try {
//             const [configs] = await pool.query('SELECT * FROM system_config');
//             res.json(configs);
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Update system configuration
//     async updateSystemConfig(req, res, next) {
//         const { config_key, config_value } = req.body;
//         const userId = req.user.id;

//         try {
//             await pool.query(
//                 'UPDATE system_config SET config_value = ?, updated_by = ? WHERE config_key = ?',
//                 [JSON.stringify(config_value), userId, config_key]
//             );

//             await createActivityLog({
//                 user_id: userId,
//                 action_type: 'UPDATE',
//                 entity_type: 'SYSTEM_CONFIG',
//                 details: { config_key, config_value }
//             });

//             res.json({ message: 'Configuration updated successfully' });
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Get reports
//     async getReports(req, res, next) {
//         const { type, batch_id, start_date, end_date } = req.query;

//         try {
//             let report;
//             switch (type) {
//                 case 'attendance':
//                     report = await this.getAttendanceReport(batch_id, start_date, end_date);
//                     break;
//                 case 'engagement':
//                     report = await this.getEngagementReport(batch_id, start_date, end_date);
//                     break;
//                 default:
//                     throw new Error('Invalid report type');
//             }

//             res.json(report);
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Get audit logs
//     async getAuditLogs(req, res, next) {
//         const { user_id, action_type, start_date, end_date } = req.query;

//         try {
//             let query = `
//                 SELECT 
//                     al.*,
//                     u.username,
//                     u.first_name,
//                     u.last_name
//                 FROM activity_logs al
//                 LEFT JOIN users u ON al.user_id = u.id
//                 WHERE 1=1
//             `;

//             const params = [];

//             if (user_id) {
//                 query += ' AND al.user_id = ?';
//                 params.push(user_id);
//             }

//             if (action_type) {
//                 query += ' AND al.action_type = ?';
//                 params.push(action_type);
//             }

//             if (start_date) {
//                 query += ' AND al.created_at >= ?';
//                 params.push(start_date);
//             }

//             if (end_date) {
//                 query += ' AND al.created_at <= ?';
//                 params.push(end_date);
//             }

//             query += ' ORDER BY al.created_at DESC';

//             const [logs] = await pool.query(query, params);
//             res.json(logs);
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Helper methods for reports
//     async getAttendanceReport(batch_id, start_date, end_date) {
//         // Implementation for attendance report
//         // This would typically involve querying attendance records
//         return { message: 'Attendance report implementation pending' };
//     }

//     async getEngagementReport(batch_id, start_date, end_date) {
//         // Implementation for engagement report
//         // This would typically involve analyzing student activity
//         return { message: 'Engagement report implementation pending' };
//     }
// }

// // Helper function to calculate percentage change
// function calculatePercentageChange(current, previous) {
//     if (!previous) return 100;
//     return ((current - previous) / previous) * 100;
// }

// module.exports = new AdminController(); 