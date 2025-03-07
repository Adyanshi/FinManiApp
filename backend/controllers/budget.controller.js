const Budget = require('../models/Budget');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const validateCategories = async (categories, userId) => {
  const categoryIds = categories.map(c => c.category);
  const existingCategories = await Category.countDocuments({
    _id: { $in: categoryIds },
    user: userId
  });
  
  if (existingCategories !== categoryIds.length) {
    throw new AppError('Invalid category found', 400);
  }
};

exports.createBudget = catchAsync(async (req, res, next) => {
    const existingBudget = await Budget.findOne({
        user: req.user.id,
        month: new Date().setDate(1)
      });
    
      if (existingBudget) {
        return next(new AppError('Budget already exists for this month', 400));
      }
  // 1) Validate categories
  await validateCategories(req.body.categories, req.user.id);

  // 2) Create budget
  const budget = await Budget.create({
    amount: req.body.amount,
    month: new Date().setDate(1), // Current month
    user: req.user.id,
    categories: req.body.categories
  });

  res.status(201).json({
    status: 'success',
    data: { budget }
  });
});

exports.getCurrentBudget = catchAsync(async (req, res) => {
  const budget = await Budget.findOne({
    user: req.user.id,
    month: { $lte: new Date(), $gte: new Date(new Date().setDate(1)) }
  }).populate('categories.category');

  res.status(200).json({
    status: 'success',
    data: { budget }
  });
});

exports.getBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate('categories.category');

  if (!budget) return next(new AppError('Budget not found', 404));
  
  res.status(200).json({
    status: 'success',
    data: { budget }
  });
});

exports.updateBudget = catchAsync(async (req, res, next) => {
  if (req.body.categories) {
    await validateCategories(req.body.categories, req.user.id);
  }

  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!budget) return next(new AppError('Budget not found', 404));
  
  res.status(200).json({
    status: 'success',
    data: { budget }
  });
});

exports.deleteBudget = catchAsync(async (req, res, next) => {
  const budget = await Budget.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!budget) return next(new AppError('Budget not found', 404));
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});