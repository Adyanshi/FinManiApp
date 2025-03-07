require('./models'); 
const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth.routes');
const transactionRouter = require('./routes/transaction.routes');
const budgetRouter = require('./routes/budget.routes');
const analyticsRouter = require('./routes/analytics.routes');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const morgan = require('morgan');

const cors = require('cors');
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to FinMani API'
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/budgets', budgetRouter);
app.use('/api/v1/analytics', analyticsRouter);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

app.use(require('./middlewares/errorHandler'));