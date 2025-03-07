const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const { protect } = require('../middlewares/auth');
const { check } = require('express-validator');

router.use(protect);

// Create/Update Budget
router.post(
  '/',
  protect,
//   [
//     check('amount').isFloat({ gt: 0 }).withMessage('Invalid amount'),
//     check('categories.*.category').isMongoId(),
//     check('categories.*.allocated').isFloat({ gt: 0 })
//   ],
  budgetController.createBudget
);

// Get Current Budget
router.get('/current', budgetController.getCurrentBudget);

// Get Budget by ID
router.get('/:id', budgetController.getBudget);

// Update Budget
router.patch(
  '/:id',
  [
    check('amount').optional().isFloat({ gt: 0 }),
    check('categories').optional().isArray()
  ],
  budgetController.updateBudget
);

// Delete Budget
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;