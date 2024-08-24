const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.db.all('SELECT * FROM mentors', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching mentors' });
      return;
    }
    res.json(rows.map(row => ({
      ...row,
      areas_of_expertise: JSON.parse(row.areas_of_expertise),
      availability: JSON.parse(row.availability),
      is_premium: Boolean(row.is_premium)
    })));
  });
});

router.get('/area/:area', (req, res) => {
  const area = req.params.area;
  req.db.all('SELECT * FROM mentors WHERE areas_of_expertise LIKE ?', [`%${area}%`], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching mentors by area' });
      return;
    }
    res.json(rows.map(row => ({
      ...row,
      areas_of_expertise: JSON.parse(row.areas_of_expertise),
      availability: JSON.parse(row.availability),
      is_premium: Boolean(row.is_premium)
    })));
  });
});

module.exports = router;