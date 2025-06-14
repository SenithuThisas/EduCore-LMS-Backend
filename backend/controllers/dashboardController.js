const db = require('../config/db');

const getAdminDashboard = async (req, res) => {
  try {
    // Get total users count
    const [usersCount] = await db.query(
      'SELECT COUNT(*) as total FROM users'
    );

    // Get users by role
    const [usersByRole] = await db.query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );

    // Format the response data with basic information
    const dashboardData = {
      totalUsers: usersCount[0].total,
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr.role] = curr.count;
        return acc;
      }, {}),
      // Provide default values for features that will be implemented later
      recentActivities: [],
      systemStats: {
        totalCourses: 0,
        activeCourses: 0,
        totalEnrollments: 0
      }
    };

    res.json({
      success: true,
      message: 'Admin dashboard data retrieved successfully',
      data: dashboardData
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    
    // Handle specific database errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        success: false,
        message: 'Database tables not properly initialized',
        error: 'Database configuration error'
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getCoordinatorDashboard = async (req, res) => {
  try {
    // Add coordinator-specific dashboard logic here
    res.json({
      message: 'Welcome to Coordinator Dashboard',
      data: {
        assignedCourses: [],
        totalStudents: 0
      }
    });
  } catch (error) {
    console.error('Coordinator dashboard error:', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

const getStudentDashboard = async (req, res) => {
  try {
    // Add student-specific dashboard logic here
    res.json({
      message: 'Welcome to Student Dashboard',
      data: {
        enrolledCourses: [],
        upcomingAssignments: []
      }
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

module.exports = {
  getAdminDashboard,
  getCoordinatorDashboard,
  getStudentDashboard
}; 