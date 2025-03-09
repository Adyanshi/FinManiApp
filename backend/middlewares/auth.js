const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

const protect = catchAsync(async (req, res, next) => {
  // 1. Get token from headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Verify token exists
  if (!token) {
    return next(new AppError('Not authorized', 401));
  }

  // 3. Verify token validity
  const decoded = await verifyToken(token, process.env.JWT_ACCESS_SECRET);

  // 4. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User no longer exists', 401));
  }

  // 5. Grant access
  req.user = currentUser;
  next();
});

const refreshTokenMiddleware = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return next(new AppError('Not authorized', 401));
  }

  const decoded = await verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );

  res.status(200).json({
    status: 'success',
    accessToken
  });
});

module.exports = {
  protect,
  refreshTokenMiddleware
};