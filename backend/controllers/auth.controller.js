const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'fail',
            message: errors.array().map(err => err.msg).join(', ')
        });
    }

    const { name, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email already exists', 400));
    }

    const newUser = await User.create({
        name,
        email,
        password
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Check for empty fields
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2. Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    // 3. Verify credentials
    if (!user || !(await user.correctPassword(password, user.password))) {
        console.log('Login failed: Incorrect email or password'); // Logging the failure
        return next(new AppError('Incorrect email or password', 401));
    }

    // 4. Generate token
    const token = signToken(user._id);

    // 5. Send response
    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
    });
});

exports.getMe = catchAsync(async (req, res, next) => {
    console.log('getMe function called'); // Log function call
    const user = await User.findById(req.user.id).select('-password');
    console.log('User retrieved:', user); // Log retrieved user

    if (!user) {
        console.error('User not found'); // Log user not found error
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
