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
  const { username, email, password, ...studentData } = req.body;
  
  try {
    // Generate unique student ID
    const [lastStudent] = await db.query(
      'SELECT user_id FROM students ORDER BY user_id DESC LIMIT 1'
    );
    const lastId = lastStudent[0]?.user_id || 'S000';
    const newId = `S${(parseInt(lastId.substring(1)) + 1).toString().padStart(3, '0')}`;
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Start transaction
    await db.beginTransaction();
    
    // Insert into users table
    await db.query(
      `INSERT INTO users (user_id, username, email, password_hash, role) 
       VALUES (?, ?, ?, ?, 'Student')`,
      [newId, username, email, passwordHash]
    );
    
    // Insert into students table
    await db.query(
      `INSERT INTO students SET ?`,
      {
        user_id: newId,
        ...studentData,
        full_name: `${studentData.first_name} ${studentData.last_name}`
      }
    );
    
    await db.commit();
    res.status(201).json({ message: 'Student created successfully', user_id: newId });
  } catch (error) {
    await db.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const studentData = req.body;
  
  try {
    if (studentData.first_name && studentData.last_name) {
      studentData.full_name = `${studentData.first_name} ${studentData.last_name}`;
    }
    
    await db.query(
      'UPDATE students SET ? WHERE user_id = ?',
      [studentData, userId]
    );
    
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  
  try {
    // Transaction ensures both user and student are deleted
    await db.beginTransaction();
    
    // Delete from students table
    await db.query('DELETE FROM students WHERE user_id = ?', [userId]);
    
    // Delete from users table
    await db.query('DELETE FROM users WHERE user_id = ?', [userId]);
    
    await db.commit();
    res.status(204).send();
  } catch (error) {
    await db.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
