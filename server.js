const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const mentorRoutes = require('./routes/mentors');
const bookingRoutes = require('./routes/bookings');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure database directory exists
const dbDirectory = path.join(__dirname, 'database');
if (!fs.existsSync(dbDirectory)){
    fs.mkdirSync(dbDirectory);
}

// Database connection
const dbPath = path.join(dbDirectory, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS mentors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      areas_of_expertise TEXT NOT NULL,
      is_premium INTEGER DEFAULT 0,
      availability TEXT
    )`, (err) => {
      if (err) {
        console.error("Error creating mentors table:", err);
      } else {
        console.log("Mentors table created or already exists.");
        addDummyData();
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      mentor_id INTEGER NOT NULL,
      area_of_interest TEXT NOT NULL,
      duration INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (mentor_id) REFERENCES mentors(id)
    )`, (err) => {
      if (err) {
        console.error("Error creating bookings table:", err);
      } else {
        console.log("Bookings table created or already exists.");
      }
    });
  });
}

function addDummyData() {
  db.get("SELECT COUNT(*) as count FROM mentors", [], (err, row) => {
    if (err) {
      console.error("Error checking mentors count", err);
      return;
    }
    if (row.count ==0) {
      const mentors = [
        ['John Doe', JSON.stringify(["FMCG Sales", "Digital Marketing"]), 0, JSON.stringify({"Monday": ["18:00", "19:00", "20:00"], "Tuesday": ["18:00", "19:00", "20:00"]})],
        ['Jane Smith', JSON.stringify(["Equity Research", "E-Commerce"]), 1, JSON.stringify({"Wednesday": ["18:00", "19:00", "20:00"], "Thursday": ["18:00", "19:00", "20:00"]})],
        ['Alice Johnson', JSON.stringify(["Digital Marketing", "E-Commerce"]), 0, JSON.stringify({"Monday": ["19:00", "20:00"], "Friday": ["18:00", "19:00", "20:00"]})],
        ['Bob Williams', JSON.stringify(["FMCG Sales", "Equity Research"]), 1, JSON.stringify({"Tuesday": ["18:00", "19:00"], "Thursday": ["19:00", "20:00"]})],
        ['Michael Brown', JSON.stringify(["Software Development", "Data Science"]), 1, JSON.stringify({"Monday": ["17:00", "18:00"], "Wednesday": ["17:00", "18:00"]})],
        ['Emily Davis', JSON.stringify(["Machine Learning", "Artificial Intelligence"]), 0, JSON.stringify({"Tuesday": ["16:00", "17:00"], "Thursday": ["16:00", "17:00"]})],
        ['Sarah Wilson', JSON.stringify(["Product Management", "Project Management"]), 1, JSON.stringify({"Wednesday": ["18:00", "19:00"], "Friday": ["18:00", "19:00"]})],
        ['David Martinez', JSON.stringify(["Cybersecurity", "Business Analytics"]), 0, JSON.stringify({"Monday": ["19:00", "20:00"], "Thursday": ["19:00", "20:00"]})],
        ['Laura Thompson', JSON.stringify(["Human Resources", "Business Analytics"]), 1, JSON.stringify({"Tuesday": ["15:00", "16:00"], "Friday": ["15:00", "16:00"]})],
        ['James Anderson', JSON.stringify(["Artificial Intelligence", "Software Development"]), 0, JSON.stringify({"Wednesday": ["17:00", "18:00"], "Thursday": ["17:00", "18:00"]})],
        ['William Clark', JSON.stringify(["Product Management", "Software Development"]), 1, JSON.stringify({"Monday": ["16:00", "17:00"], "Wednesday": ["16:00", "17:00"]})],
        ['Jessica Lee', JSON.stringify(["Data Science", "Machine Learning"]), 0, JSON.stringify({"Tuesday": ["14:00", "15:00"], "Thursday": ["14:00", "15:00"]})],
        ['Matthew Evans', JSON.stringify(["Project Management", "Cybersecurity"]), 1, JSON.stringify({"Wednesday": ["18:00", "19:00"], "Friday": ["18:00", "19:00"]})],
        ['Olivia Harris', JSON.stringify(["E-Commerce", "Digital Marketing"]), 0, JSON.stringify({"Monday": ["15:00", "16:00"], "Thursday": ["15:00", "16:00"]})],
        ['Sophia King', JSON.stringify(["Software Development", "Data Science"]), 1, JSON.stringify({"Tuesday": ["16:00", "17:00"], "Friday": ["16:00", "17:00"]})],
        ['Benjamin Scott', JSON.stringify(["Artificial Intelligence", "Machine Learning"]), 0, JSON.stringify({"Monday": ["14:00", "15:00"], "Wednesday": ["14:00", "15:00"]})],
        ['Isabella Young', JSON.stringify(["Human Resources", "Product Management"]), 1, JSON.stringify({"Tuesday": ["15:00", "16:00"], "Thursday": ["15:00", "16:00"]})],
        ['Liam Hill', JSON.stringify(["Cybersecurity", "Data Science"]), 0, JSON.stringify({"Wednesday": ["17:00", "18:00"], "Friday": ["17:00", "18:00"]})],
        ['Ava Baker', JSON.stringify(["Project Management", "Business Analytics"]), 1, JSON.stringify({"Monday": ["16:00", "17:00"], "Thursday": ["16:00", "17:00"]})],
        ['Mason Perez', JSON.stringify(["Artificial Intelligence", "Software Development"]), 0, JSON.stringify({"Tuesday": ["17:00", "18:00"], "Friday": ["17:00", "18:00"]})],
        ['Mia Gonzalez', JSON.stringify(["Digital Marketing", "E-Commerce"]), 1, JSON.stringify({"Monday": ["18:00", "19:00"], "Wednesday": ["18:00", "19:00"]})],
        ['Ethan White', JSON.stringify(["Software Development", "Cybersecurity"]), 0, JSON.stringify({"Tuesday": ["15:00", "16:00"], "Thursday": ["15:00", "16:00"]})],
        ['Amelia Carter', JSON.stringify(["Human Resources", "Business Analytics"]), 1, JSON.stringify({"Wednesday": ["16:00", "17:00"], "Friday": ["16:00", "17:00"]})],
        ['Alexander Rogers', JSON.stringify(["Machine Learning", "Data Science"]), 0, JSON.stringify({"Monday": ["17:00", "18:00"], "Thursday": ["17:00", "18:00"]})],
        ['Harper Ward', JSON.stringify(["Product Management", "Project Management"]), 1, JSON.stringify({"Tuesday": ["16:00", "17:00"], "Friday": ["16:00", "17:00"]})]
      ];
      
      const insertMentor = db.prepare("INSERT INTO mentors (name, areas_of_expertise, is_premium, availability) VALUES (?, ?, ?, ?)");
      mentors.forEach(mentor => insertMentor.run(mentor));
      insertMentor.finalize();
      
      console.log("Added initial mentors to the database");
    } else {
      console.log("Mentors already exist in the database");
    }
  });
}



// Make db available to our routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/mentors', mentorRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});