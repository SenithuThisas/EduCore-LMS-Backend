const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- Dashboard Summary ---
router.get('/summary', async (req, res) => {
  try {
    // Total students
    const [[{ students }]] = await db.query('SELECT COUNT(*) as students FROM students');
    // Total courses
    const [[{ courses }]] = await db.query('SELECT COUNT(*) as courses FROM courses');
    // Total assignments
    const [[{ assignments }]] = await db.query('SELECT COUNT(*) as assignments FROM assignments');
    // Average grade (adjust table/column as needed)
    const [[{ grade }]] = await db.query('SELECT AVG(grade) as grade FROM student_grades');
    res.json({
      students,
      courses,
      assignments,
      grade: grade ? Number(grade).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// --- Students ---
router.get('/students', async (req, res) => {
  try {
    const [students] = await db.query('SELECT * FROM students');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.post('/students', async (req, res) => {
  const { firstName, lastName, email, batch, ...rest } = req.body;
  try {
    // Adjust fields as needed
    await db.query(
      'INSERT INTO students (first_name, last_name, email, batch) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, batch]
    );
    res.status(201).json({ message: 'Student created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// --- Courses ---
router.get('/courses', async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.post('/courses', async (req, res) => {
  const { title, code, instructor, students, duration } = req.body;
  try {
    await db.query(
      'INSERT INTO courses (title, code, instructor, students, duration) VALUES (?, ?, ?, ?, ?)',
      [title, code, instructor, students, duration]
    );
    res.status(201).json({ message: 'Course created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// --- Assignments ---
router.get('/assignments', async (req, res) => {
  try {
    const [assignments] = await db.query('SELECT * FROM assignments');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

router.post('/assignments', async (req, res) => {
  const { title, course, due, description } = req.body;
  try {
    await db.query(
      'INSERT INTO assignments (title, course, due, description) VALUES (?, ?, ?, ?)',
      [title, course, due, description]
    );
    res.status(201).json({ message: 'Assignment created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

module.exports = router;
