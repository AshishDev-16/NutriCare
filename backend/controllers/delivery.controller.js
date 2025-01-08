const Meal = require('../models/Meal');
const Task = require('../models/Task');

// @desc    Get all deliveries for delivery staff
// @route   GET /api/v1/deliveries
// @access  Private (Delivery Staff)
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Meal.find({
      status: { $in: ['ready', 'delivering'] },
      deliveredBy: null
    })
      .populate('patient', 'name roomNumber bedNumber floorNumber')
      .populate('dietChart', 'dietaryRestrictions')
      .populate('assignedTo', 'name');

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my deliveries (completed)
// @route   GET /api/v1/deliveries/my-deliveries
// @access  Private (Delivery Staff)
exports.getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Meal.find({
      deliveredBy: req.user.id,
      status: 'delivered'
    })
      .populate('patient', 'name roomNumber bedNumber floorNumber')
      .populate('dietChart', 'dietaryRestrictions');

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Start delivery
// @route   PUT /api/v1/deliveries/:id/start
// @access  Private (Delivery Staff)
exports.startDelivery = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    if (meal.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Meal is not ready for delivery'
      });
    }

    meal.status = 'delivering';
    meal.assignedTo = req.user.id;
    await meal.save();

    // Update associated task
    await Task.findOneAndUpdate(
      { meal: meal._id },
      { 
        status: 'in-progress',
        startTime: Date.now()
      }
    );

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

// @desc    Complete delivery
// @route   PUT /api/v1/deliveries/:id/complete
// @access  Private (Delivery Staff)
exports.completeDelivery = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    if (meal.status !== 'delivering') {
      return res.status(400).json({
        success: false,
        message: 'Meal is not being delivered'
      });
    }

    if (meal.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this delivery'
      });
    }

    meal.status = 'delivered';
    meal.deliveredBy = req.user.id;
    meal.deliveryTime = Date.now();
    await meal.save();

    // Update associated task
    await Task.findOneAndUpdate(
      { meal: meal._id },
      { 
        status: 'completed',
        completionTime: Date.now()
      }
    );

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

// @desc    Get delivery statistics
// @route   GET /api/v1/deliveries/stats
// @access  Private (Manager)
exports.getDeliveryStats = async (req, res) => {
  try {
    const stats = await Meal.aggregate([
      {
        $match: {
          status: 'delivered'
        }
      },
      {
        $group: {
          _id: '$deliveredBy',
          totalDeliveries: { $sum: 1 },
          averageDeliveryTime: {
            $avg: {
              $subtract: ['$deliveryTime', '$preparationTime']
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'deliveryStaff'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 