const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for faster querying
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);