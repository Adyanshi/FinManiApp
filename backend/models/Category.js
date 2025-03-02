const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [30, 'Category name cannot exceed 30 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  icon: {
    type: String,
    default: 'md-cash' // Default icon (Ionicons format)
  },
  color: {
    type: String,
    default: '#4a90e2'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

// Prevent duplicate categories per user
categorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;