import express from 'express';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'event_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, time, location, image } = req.body;
    const [result] = await pool.query(
      'INSERT INTO events (title, description, date, time, location, image) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, date, time, location, image]
    );
    
    // Send notification email to admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Event Created',
      html: `
        <h1>New Event Created</h1>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Location:</strong> ${location}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get managed events
app.get('/api/events/managed', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.*, 
        COUNT(r.id) as registrations 
      FROM events e 
      LEFT JOIN registrations r ON e.id = r.event_id 
      GROUP BY e.id
      ORDER BY e.date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching managed events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register for event
app.post('/api/events/:id/register', async (req, res) => {
  try {
    const { email, name } = req.body;
    const eventId = req.params.id;
    
    // Get event details
    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId]);
    const event = events[0];
    
    // Create registration
    await pool.query(
      'INSERT INTO registrations (event_id, email, name) VALUES (?, ?, ?)',
      [eventId, email, name]
    );
    
    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Registration Confirmed: ${event.title}`,
      html: `
        <h1>Registration Confirmed</h1>
        <p>Thank you for registering for ${event.title}!</p>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Location:</strong> ${event.location}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});