// GET all assignments
router.get('/api/assignments', async (req, res) => {
    try {
      const [assignments] = await db.query('SELECT * FROM assignments');
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  });
  
  // POST new assignment
  router.post('/api/assignments', async (req, res) => {
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
  