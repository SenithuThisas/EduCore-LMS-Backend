const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('[database] Connected to MySQL.');
    connection.release();
  } catch (error) {
    console.error('[database] Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;
