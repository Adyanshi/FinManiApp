// models/index.js
const mongoose = require('mongoose');

// Load models in dependency order
require('./Category');
require('./User');
require('./Transaction');
require('./Budget');

module.exports = mongoose.models;