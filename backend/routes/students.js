const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET /api/students — fetch all students
router.get('/', async (req, res) => {
  try {
    const [students] = await db.query('SELECT * FROM students');
    res.json(students);
  } catch (error) {
    console.error('❌ Failed to fetch students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST /api/students — add new student
router.post('/', async (req, res) => {
  const { username, email, password, profileImg, ...studentData } = req.body;
  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    // Generate user_id (batch-based student number)
    const batch = studentData.batch;
    const [existing] = await conn.query(
      "SELECT user_id FROM students WHERE batch = ? ORDER BY user_id DESC LIMIT 1", [batch]
    );
    let nextNum = 1;
    if (existing.length > 0 && existing[0].user_id) {
      const lastId = existing[0].user_id;
      const parts = lastId.split('-');
      const numPart = parts[parts.length - 1];
      const num = parseInt(numPart, 10);
      if (!isNaN(num)) nextNum = num + 1;
    }
    const newUserId = `${batch}-${String(nextNum).padStart(4, '0')}`;

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert into users table
    await conn.query(
      `INSERT INTO users (user_id, username, email, password_hash, role) 
       VALUES (?, ?, ?, ?, 'Student')`,
      [newUserId, username, email, passwordHash]
    );

    // Insert into students table
    await conn.query(
      `INSERT INTO students SET ?`,
      {
        user_id: newUserId,
        profile_picture: profileImg,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        full_name: `${studentData.firstName} ${studentData.lastName}`,
        gender: studentData.gender,
        date_of_birth: studentData.dateOfBirth,
        course: studentData.course,
        batch: studentData.batch,
        NIC: studentData.nic,
        mobile_number: studentData.mobileNumber,
        parents_number: studentData.parentsNumber
      }
    );

    await conn.commit();
    res.status(201).json({ message: 'Student created successfully', user_id: newUserId });

  } catch (error) {
    if (conn) await conn.rollback();
    console.error('❌ Error during student creation:', error);
    res.status(500).json({ error: 'Failed to create student' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
