const AppError = require('../utils/appError');

const handleJWTError = () => new AppError('Invalid token!', 401);
const handleJWTExpiredError = () => new AppError('Token expired!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message
  });
};