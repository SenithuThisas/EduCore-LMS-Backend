// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || '', // fallback to empty string if undefined
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: test connection on startup
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to the database.');
    connection.release(); // release back to pool
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // exit if DB connection fails
  }
}

testConnection();

module.exports = db;
