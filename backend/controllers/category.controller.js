const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');

exports.getUserCategories = catchAsync(async (req, res) => {
    const categories = await Category.find({ user: req.user.id });
    
    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: { categories }
    });
});