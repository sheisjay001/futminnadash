const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// TiDB Connection Configuration
// Update these with your TiDB credentials
const dbConfig = {
  host: process.env.TIDB_HOST || 'localhost',
  port: process.env.TIDB_PORT || 4000,
  user: process.env.TIDB_USER || 'root',
  password: process.env.TIDB_PASSWORD || '',
  database: process.env.TIDB_DATABASE || 'futminnadash',
  ssl: {}
};

let pool;

async function initDB() {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Create scores table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        faculty VARCHAR(10) NOT NULL,
        department VARCHAR(10) NOT NULL,
        cgpa DECIMAL(3,2) NOT NULL,
        timeRemaining DECIMAL(5,2) NOT NULL,
        win BOOLEAN NOT NULL,
        timestamp BIGINT NOT NULL,
        INDEX idx_faculty (faculty),
        INDEX idx_dept (department),
        INDEX idx_cgpa (cgpa DESC)
      )
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// Save score endpoint
app.post('/api/scores', async (req, res) => {
  try {
    const { name, faculty, department, cgpa, timeRemaining, win, timestamp } = req.body;
    
    if (!name || !faculty || !department || cgpa === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await pool.execute(
      'INSERT INTO scores (name, faculty, department, cgpa, timeRemaining, win, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, faculty, department, cgpa, timeRemaining, win, timestamp]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Get leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { faculty, department } = req.query;
    
    let query = 'SELECT name, faculty, department, cgpa FROM scores';
    const params = [];
    
    if (faculty) {
      query += ' WHERE faculty = ?';
      params.push(faculty);
      
      if (department) {
        query += ' AND department = ?';
        params.push(department);
      }
    }
    
    query += ' ORDER BY cgpa DESC LIMIT 50';
    
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get best graduating student by department
app.get('/api/best/department/:dept', async (req, res) => {
  try {
    const { dept } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT name, faculty, department, cgpa, timestamp FROM scores WHERE department = ? ORDER BY cgpa DESC LIMIT 1',
      [dept]
    );
    
    if (rows.length === 0) {
      return res.json({ error: 'No scores found for this department' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching best department:', error);
    res.status(500).json({ error: 'Failed to fetch best department' });
  }
});

// Get best graduating student by faculty
app.get('/api/best/faculty/:faculty', async (req, res) => {
  try {
    const { faculty } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT name, faculty, department, cgpa, timestamp FROM scores WHERE faculty = ? ORDER BY cgpa DESC LIMIT 1',
      [faculty]
    );
    
    if (rows.length === 0) {
      return res.json({ error: 'No scores found for this faculty' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching best faculty:', error);
    res.status(500).json({ error: 'Failed to fetch best faculty' });
  }
});

// Get overall best
app.get('/api/best/overall', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT name, faculty, department, cgpa, timestamp FROM scores ORDER BY cgpa DESC LIMIT 1'
    );
    
    if (rows.length === 0) {
      return res.json({ error: 'No scores found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching overall best:', error);
    res.status(500).json({ error: 'Failed to fetch overall best' });
  }
});

const PORT = process.env.PORT || 3000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
