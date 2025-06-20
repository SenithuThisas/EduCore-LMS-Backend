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
  
  try {
    // Generate unique coordinator ID
    const [lastCoordinator] = await db.query(
      'SELECT user_id FROM coordinators ORDER BY user_id DESC LIMIT 1'
    );
    const lastId = lastCoordinator[0]?.user_id || 'C000';
    const newId = `C${(parseInt(lastId.substring(1)) + 1).toString().padStart(3, '0')}`;
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Start transaction
    await db.beginTransaction();
    
    // Insert into users table
    await db.query(
      `INSERT INTO users (user_id, username, email, password_hash, role) 
       VALUES (?, ?, ?, ?, 'Coordinator')`,
      [newId, username, email, passwordHash]
    );
    
    // Insert into coordinators table
    await db.query(
      `INSERT INTO coordinators SET ?`,
      {
        user_id: newId,
        ...coordinatorData
      }
    );
    
    await db.commit();
    res.status(201).json({ message: 'Coordinator created successfully', user_id: newId });
  } catch (error) {
    await db.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to create coordinator' });
  }
});

// Update coordinator
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const coordinatorData = req.body;
  
  try {
    await db.query(
      'UPDATE coordinators SET ? WHERE user_id = ?',
      [coordinatorData, userId]
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
  
  try {
    // Transaction ensures both user and coordinator are deleted
    await db.beginTransaction();
    
    // Delete from coordinators table
    await db.query('DELETE FROM coordinators WHERE user_id = ?', [userId]);
    
    // Delete from users table
    await db.query('DELETE FROM users WHERE user_id = ?', [userId]);
    
    await db.commit();
    res.status(204).send();
  } catch (error) {
    await db.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to delete coordinator' });
  }
});

module.exports = router;
