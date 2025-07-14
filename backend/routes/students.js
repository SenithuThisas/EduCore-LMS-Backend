const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or configure as needed

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

// Add this route before the POST route
router.get('/next-id/:batch', async (req, res) => {
  try {
    const { batch } = req.params;
    
    const [existing] = await db.query(
      "SELECT user_id FROM students WHERE batch = ? AND user_id LIKE ? ORDER BY user_id DESC LIMIT 1", 
      [batch, `${batch}-%`]
    );
    
    let nextNum = 1;
    if (existing.length > 0 && existing[0].user_id) {
      const lastId = existing[0].user_id;
      const parts = lastId.split('-');
      if (parts.length >= 2) {
        const numPart = parts[parts.length - 1];
        const num = parseInt(numPart, 10);
        if (!isNaN(num)) nextNum = num + 1;
      }
    }
    
    const nextUserId = `${batch}-${String(nextNum).padStart(4, '0')}`;
    res.json({ nextUserId });
    
  } catch (error) {
    console.error('❌ Error generating next ID:', error);
    res.status(500).json({ error: 'Failed to generate next ID' });
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
    console.log('🔍 Generating ID for batch:', batch);
    console.log('🔍 Full studentData:', studentData); // Debug log
    
    // Validate batch value
    if (!batch || batch.trim() === '') {
      throw new Error('Batch value is empty or undefined');
    }
    
    const [existing] = await conn.query(
      "SELECT user_id FROM students WHERE batch = ? AND user_id LIKE ? ORDER BY user_id DESC LIMIT 1", 
      [batch, `${batch}-%`]
    );
    
    console.log('📊 Existing students found:', existing);
    
    let nextNum = 1;
    if (existing.length > 0 && existing[0].user_id) {
      const lastId = existing[0].user_id;
      console.log('🔢 Last ID found:', lastId);
      
      const parts = lastId.split('-');
      console.log('🔧 Split parts:', parts); // Debug log
      
      if (parts.length >= 2) {
        const numPart = parts[parts.length - 1];
        console.log('🔧 Number part:', numPart); // Debug log
        const num = parseInt(numPart, 10);
        if (!isNaN(num)) nextNum = num + 1;
      }
    }
    
    const newUserId = `${batch}-${String(nextNum).padStart(4, '0')}`;
    console.log('✨ Generated new user ID:', newUserId);
    console.log('✨ Batch value used:', `"${batch}"`); // Debug log
    console.log('✨ Next number:', nextNum); // Debug log

    // Validate the generated ID before using it
    if (newUserId.endsWith('-')) {
      throw new Error('Generated user ID is incomplete');
    }

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
    console.error('❌ Full error details:', error.message); // More detailed error
    res.status(500).json({ error: 'Failed to create student', details: error.message });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
