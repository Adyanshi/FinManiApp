const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget cannot be negative']
  },
  month: {
    type: Date,
    required: true,
    default: () => new Date(new Date().setDate(1)) // Default to first day of current month
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    },
    allocated: {
      type: Number,
      min: [0, 'Allocated amount cannot be negative']
    }
  }]
});

// Unique budget per user per month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);