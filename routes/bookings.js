const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { student_name, mentor_id, area_of_interest, duration, start_time } = req.body;
  const query = 'INSERT INTO bookings (student_name, mentor_id, area_of_interest, duration, start_time) VALUES (?, ?, ?, ?, ?)';
  req.db.run(query, [student_name, mentor_id, area_of_interest, duration, start_time], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error creating booking' });
      return;
    }
    res.status(201).json({ id: this.lastID, message: 'Booking created successfully' });
  });
});

router.get('/mentor/:mentorId', (req, res) => {
  const mentorId = req.params.mentorId;
  req.db.all('SELECT * FROM bookings WHERE mentor_id = ?', [mentorId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching bookings' });
      return;
    }
    res.json(rows);
  });
});


// router.get('/', (req, res) => {
//     req.db.all('SELECT * FROM bookings', [], (err, rows) => {
//       if (err) {
//         res.status(500).json({ error: 'Error fetching bookings' });
//         return;
//       }
//       res.json(rows);
//     });
//   });

router.get('/', (req, res) => {
    const query = `
      SELECT 
        bookings.id AS booking_id,
        bookings.student_name,
        bookings.mentor_id,
        bookings.area_of_interest,
        bookings.duration,
        bookings.start_time,
        bookings.status,
        mentors.name AS mentor_name
      FROM bookings
      LEFT JOIN mentors ON bookings.mentor_id = mentors.id;
    `;
    
    req.db.all(query, [], (err, rows) => {
      if (err) {
        console.error('SQL Error:', err); // Log detailed error
        res.status(500).json({ error: 'Error fetching bookings', details: err.message });
        return;
      }
      res.json(rows);
    });
  });
  

 
  

module.exports = router;