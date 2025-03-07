const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth');

router.use(protect);

// Monthly Summary
router.get('/monthly-summary', analyticsController.getMonthlySummary);

// Category-wise Spending
router.get('/category-spending', analyticsController.getCategorySpending);

// Budget Progress
router.get('/budget-progress', analyticsController.getBudgetProgress);

module.exports = router;