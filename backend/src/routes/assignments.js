const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');

// Multer config: store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (!file) return cb(null, true); // allow no file
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-rar-compressed'
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF, DOCX, ZIP, and RAR files are allowed'));
  }
});

// ---------- CREATE ASSIGNMENT WITH OPTIONAL FILE UPLOAD ----------
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, code, due, status, icon, submitted } = req.body;
    if (!title || !code || !due) {
      return res.status(400).json({ message: 'Title, code, and due date are required.' });
    }

    // 1. Insert assignment
    const [result] = await db.query(
      'INSERT INTO assignments (title, code, due, status, icon, submitted) VALUES (?, ?, ?, ?, ?, ?)',
      [title, code, due, status || 'Active', icon || '📄', submitted || '0/0']
    );
    const assignmentId = result.insertId;

    // 2. If file present, insert into assignment_files
    if (req.file) {
      const { originalname, mimetype, buffer } = req.file;
      await db.query(
        'INSERT INTO assignment_files (assignment_id, filename, mimetype, filedata) VALUES (?, ?, ?, ?)',
        [assignmentId, originalname, mimetype, buffer]
      );
    }

    // 3. Fetch the created assignment and attached files
    const [assignments] = await db.query('SELECT * FROM assignments WHERE id = ?', [assignmentId]);
    const assignment = assignments[0];
    const [files] = await db.query('SELECT id, filename FROM assignment_files WHERE assignment_id = ?', [assignmentId]);
    assignment.files = files;

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Assignment create error:', error);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
});

// ---------- UPLOAD FILE TO EXISTING ASSIGNMENT ----------
router.post('/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const assignmentId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const { originalname, mimetype, buffer } = req.file;

    await db.query(
      'INSERT INTO assignment_files (assignment_id, filename, mimetype, filedata) VALUES (?, ?, ?, ?)',
      [assignmentId, originalname, mimetype, buffer]
    );

    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

// ---------- DOWNLOAD FILE ----------
router.get('/files/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const [files] = await db.query('SELECT * FROM assignment_files WHERE id = ?', [fileId]);
    const file = files[0];
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.setHeader('Content-Type', file.mimetype);
    res.send(file.filedata);
  } catch (error) {
    res.status(500).json({ message: 'Failed to download file' });
  }
});

// ---------- GET ALL ASSIGNMENTS WITH FILE LISTS ----------
router.get('/', async (req, res) => {
  try {
    // Get all assignments
    const [assignments] = await db.query('SELECT * FROM assignments ORDER BY id DESC');
    // For each assignment, get its files
    for (const assignment of assignments) {
      const [files] = await db.query(
        'SELECT id, filename FROM assignment_files WHERE assignment_id = ?',
        [assignment.id]
      );
      assignment.files = files;
    }
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
});

module.exports = router;
