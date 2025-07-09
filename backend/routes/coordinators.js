const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Get all coordinators
router.get('/', async (req, res) => {
  try {
    const [coordinators] = await db.query('SELECT * FROM coordinators');
    res.json(coordinators);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch coordinators' });
  }
});

// Add new coordinator
router.post('/', async (req, res) => {
  const { username, email, password, ...coordinatorData } = req.body;
  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [lastCoordinator] = await conn.query(
      'SELECT user_id FROM coordinators ORDER BY user_id DESC LIMIT 1'
    );
    const lastId = lastCoordinator[0]?.user_id || 'C000';
    const newId = `C${(parseInt(lastId.substring(1)) + 1).toString().padStart(3, '0')}`;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await conn.query(
      `INSERT INTO users (user_id, username, email, password_hash, role) 
       VALUES (?, ?, ?, ?, 'Coordinator')`,
      [newId, username, email, passwordHash]
    );

    await conn.query(
      `INSERT INTO coordinators SET ?`,
      {
        user_id: newId,
        ...coordinatorData
      }
    );

    await conn.commit();
    res.status(201).json({ message: 'Coordinator created successfully', user_id: newId });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to create coordinator' });
  } finally {
    if (conn) conn.release();
  }
});

// Update coordinator (no 'role' field)
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { assigned_batch, department, profile_picture } = req.body;
  const updateData = {};
  if (assigned_batch !== undefined) updateData.assigned_batch = assigned_batch;
  if (department !== undefined) updateData.department = department;
  if (profile_picture !== undefined) updateData.profile_picture = profile_picture;

  try {
    await db.query(
      'UPDATE coordinators SET ? WHERE user_id = ?',
      [updateData, userId]
    );
    res.json({ message: 'Coordinator updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update coordinator' });
  }
});

// Delete coordinator
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    await conn.query('DELETE FROM coordinators WHERE user_id = ?', [userId]);
    await conn.query('DELETE FROM users WHERE user_id = ?', [userId]);

    await conn.commit();
    res.status(204).send();
  } catch (error) {
    if (conn) await conn.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to delete coordinator' });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
