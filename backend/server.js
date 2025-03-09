require('dotenv').config();
require('./models');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./routes/auth.routes');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Database connection
connectDB();

// Routes
app.use('/api/v1', authRouter);
app.use(require('./middlewares/errorHandler'));
// Health check
app.get('/api/v1/healthcheck', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});