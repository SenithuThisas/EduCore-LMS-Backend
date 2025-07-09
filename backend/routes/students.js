const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Get all students
router.get('/', async (req, res) => {
  try {
    const [students] = await db.query('SELECT * FROM students');
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Add new student
router.post('/', async (req, res) => {
  const { username, email, password, profileImg, ...studentData } = req.body;

  try {
    const [lastStudent] = await db.query(
      'SELECT user_id FROM students ORDER BY user_id DESC LIMIT 1'
    );
    const lastId = lastStudent[0]?.user_id || 'S000';
    const newId = `S${(parseInt(lastId.substring(1)) + 1).toString().padStart(3, '0')}`;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await db.beginTransaction();

    await db.query(
      `INSERT INTO users (user_id, username, email, password_hash, role) 
       VALUES (?, ?, ?, ?, 'Student')`,
      [newId, username, email, passwordHash]
    );

    console.log('Inserting student with data:', {
      user_id: newId,
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
      parents_number: studentData.parentsNumber,
    });

    await db.query(
      `INSERT INTO students SET ?`,
      {
        user_id: newId,
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

    await db.commit();
    res.status(201).json({ message: 'Student created successfully', user_id: newId });

  } catch (error) {
    await db.rollback();
    console.error('❌ Error during student creation:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Export the router so it can be mounted in server.js
module.exports = router;
