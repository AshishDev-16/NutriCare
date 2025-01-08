const Meal = require('../models/Meal');

// @desc    Get all meals
// @route   GET /api/v1/meals
// @access  Private
exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find()
      .populate('patient', 'name roomNumber bedNumber')
      .populate('dietChart', 'dietaryRestrictions')
      .populate('assignedTo', 'name')
      .populate('deliveredBy', 'name');

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single meal
// @route   GET /api/v1/meals/:id
// @access  Private
exports.getMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
      .populate('patient', 'name roomNumber bedNumber')
      .populate('dietChart', 'dietaryRestrictions')
      .populate('assignedTo', 'name')
      .populate('deliveredBy', 'name');

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new meal
// @route   POST /api/v1/meals
// @access  Private (Manager Only)
exports.createMeal = async (req, res) => {
  try {
    const meal = await Meal.create(req.body);

    res.status(201).json({
      success: true,
      data: meal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update meal status
// @route   PUT /api/v1/meals/:id
// @access  Private
exports.updateMealStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status };

    // Add timestamps based on status
    if (status === 'preparing') {
      updates.preparationTime = Date.now();
    } else if (status === 'delivered') {
      updates.deliveryTime = Date.now();
      updates.deliveredBy = req.user.id;
    }

    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign meal to staff
// @route   PUT /api/v1/meals/:id/assign
// @access  Private (Manager Only)
exports.assignMeal = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      {
        new: true,
        runValidators: true
      }
    );

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 