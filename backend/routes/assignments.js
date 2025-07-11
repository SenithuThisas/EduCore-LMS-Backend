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
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-rar-compressed'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF, DOCX, ZIP, and RAR files are allowed'));
  }
});

// Upload endpoint (POST /api/assignments/:id/upload)
router.post('/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const assignmentId = req.params.id;
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

// Download endpoint (GET /api/assignments/files/:fileId)
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

module.exports = router;
