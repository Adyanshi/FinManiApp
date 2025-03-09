// models/User.js
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const Category = require('./Category');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  // currency: {
  //   type: String,
  //   default: '₹',
  //   enum: ['₹', '$', '€', '£']
  // },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ====== PASSWORD HASHING MIDDLEWARE ======
userSchema.pre('save', async function(next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ====== DEFAULT CATEGORIES CREATION ======
userSchema.post('save', async function(user) {
  const Category = mongoose.model('Category');
    const defaultCategories = [
      { name: 'Salary', type: 'income', icon: 'md-cash', isDefault: true },
      { name: 'Food', type: 'expense', icon: 'md-restaurant', isDefault: true },
      { name: 'Transport', type: 'expense', icon: 'md-car', isDefault: true },
      { name: 'Housing', type: 'expense', icon: 'md-home', isDefault: true },
      { name: 'Utilities', type: 'expense', icon: 'md-bulb', isDefault: true },
      { name: 'Health', type: 'expense', icon: 'md-medkit', isDefault: true }
    ];
  
    try {
      await Category.insertMany(
        defaultCategories.map(cat => ({ 
          ...cat, 
          user: user._id 
        }))
      );
    } catch (err) {
      console.log('Error creating default categories:', err.message);
    }
  });
// ====== PASSWORD VERIFICATION METHOD ======
userSchema.methods.correctPassword = async function(
  candidatePassword, 
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);