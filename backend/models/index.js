// models/index.js
const mongoose = require('mongoose');

// Load models in dependency order
require('./User');
require('./Category');
require('./Transaction');
require('./Budget');

module.exports = {
  User: mongoose.model('User'),
  Category: mongoose.model('Category'),
  Transaction: mongoose.model('Transaction'),
  Budget: mongoose.model('Budget')
};