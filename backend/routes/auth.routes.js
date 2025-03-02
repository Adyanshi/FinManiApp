const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { check } = require('express-validator');

router.post(
  '/signup',
  [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email required'),
    check('password').isLength({ min: 8 }).withMessage('Minimum 8 characters')
  ],
  authController.signup
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email required'),
    check('password').exists().withMessage('Password required')
  ],
  authController.login
);

module.exports = router;