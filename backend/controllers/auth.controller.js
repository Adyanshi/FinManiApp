const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id, secret, expiresIn) => {
  return jwt.sign({ id }, secret, { expiresIn });
};


exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    currency: req.body.currency || '₹'
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        currency: newUser.currency
      }
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Generate JWT tokens
  const accessToken = signToken(
    user._id,
    process.env.JWT_ACCESS_SECRET,
    process.env.JWT_ACCESS_EXPIRES
  );

  const refreshToken = signToken(
    user._id,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES
  );

  // 4) Set secure cookies
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(200).json({
    status: 'success',
    accessToken,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency
      }
    }
  });
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return next(new AppError('Authentication required', 401));
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  const newAccessToken = signToken(
    user._id,
    process.env.JWT_ACCESS_SECRET,
    process.env.JWT_ACCESS_EXPIRES
  );

  res.status(200).json({
    status: 'success',
    accessToken: newAccessToken
  });
});
