const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', categoryController.getUserCategories);

module.exports = router;