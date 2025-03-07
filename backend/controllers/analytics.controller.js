const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMonthlySummary = catchAsync(async (req, res) => {
  const monthlyData = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        date: {
          $gte: new Date(new Date().getFullYear(), 0, 1), // Current year
          $lte: new Date()
        }
      }
    },
    {
      $group: {
        _id: { $month: "$date" },
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
        }
      }
    },
    {
      $project: {
        month: "$_id",
        totalIncome: 1,
        totalExpenses: 1,
        netSavings: { $subtract: ["$totalIncome", "$totalExpenses"] }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: monthlyData
  });
});

exports.getCategorySpending = catchAsync(async (req, res) => {
  const categorySpending = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: "expense",
        date: {
          $gte: new Date(new Date().setDate(1)), // Current month
          $lte: new Date()
        }
      }
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $project: {
        category: "$category.name",
        total: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: categorySpending
  });
});

exports.getBudgetProgress = catchAsync(async (req, res) => {
  const currentBudget = await Budget.findOne({
    user: req.user._id,
    month: { $lte: new Date(), $gte: new Date(new Date().setDate(1)) }
  }).populate('categories.category');

  if (!currentBudget) {
    return res.status(200).json({
      status: 'success',
      data: { message: "No budget set for current month" }
    });
  }

  const categorySpending = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: "expense",
        date: {
          $gte: currentBudget.month,
          $lte: new Date()
        }
      }
    },
    {
      $group: {
        _id: "$category",
        spent: { $sum: "$amount" }
      }
    }
  ]);

  const progress = currentBudget.categories.map(budgetCategory => {
    const spentData = categorySpending.find(c => c._id.equals(budgetCategory.category._id));
    return {
      category: budgetCategory.category.name,
      allocated: budgetCategory.allocated,
      spent: spentData?.spent || 0,
      remaining: budgetCategory.allocated - (spentData?.spent || 0)
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalBudget: currentBudget.amount,
      totalSpent: progress.reduce((sum, p) => sum + p.spent, 0),
      categories: progress
    }
  });
});