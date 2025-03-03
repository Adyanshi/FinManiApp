require('./models'); 
const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth.routes');
const transactionRouter = require('./routes/transaction.routes');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const morgan = require('morgan');

const app = express();

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

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

app.use(require('./middlewares/errorHandler'));