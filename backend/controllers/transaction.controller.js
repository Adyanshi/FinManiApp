const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createTransaction = catchAsync(async (req, res, next) => {
  // 1) Verify category exists and belongs to user
  const category = await Category.findOne({
    _id: req.body.category,
    user: req.user.id
  });

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // 2) Create transaction
  const transaction = await Transaction.create({
    ...req.body,
    user: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { transaction }
  });
});

exports.getAllTransactions = catchAsync(async (req, res) => {
  // 1) Filtering
  const filter = { user: req.user.id };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;

  // 2) Execute query
  const transactions = await Transaction.find(filter)
    .sort('-date')
    .populate('category');

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: { transactions }
  });
});

exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate('category');

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { transaction }
  });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { transaction }
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});