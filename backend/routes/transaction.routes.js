const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { protect } = require('../middlewares/auth');
const { check } = require('express-validator');

router.use(protect); // Protect all transaction routes

// Create Transaction
router.post(
  '/',
  [
    check('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
    check('type').isIn(['income', 'expense']).withMessage('Invalid type'),
    check('category').isMongoId().withMessage('Invalid category ID')
  ],
  transactionController.createTransaction
);

// Get All Transactions
router.get('/', transactionController.getAllTransactions);

// Get Transaction by ID
router.get('/:id', transactionController.getTransaction);

// Update Transaction
router.patch(
  '/:id',
  [
    check('amount').optional().isFloat({ gt: 0 }),
    check('category').optional().isMongoId()
  ],
  transactionController.updateTransaction
);

// Delete Transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;