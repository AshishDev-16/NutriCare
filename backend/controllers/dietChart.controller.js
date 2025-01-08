const DietChart = require('../models/DietChart');

// @desc    Get all diet charts
// @route   GET /api/v1/diet-charts
// @access  Private
exports.getDietCharts = async (req, res) => {
  try {
    const dietCharts = await DietChart.find()
      .populate('patient', 'name roomNumber bedNumber')
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: dietCharts.length,
      data: dietCharts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single diet chart
// @route   GET /api/v1/diet-charts/:id
// @access  Private
exports.getDietChart = async (req, res) => {
  try {
    const dietChart = await DietChart.findById(req.params.id)
      .populate('patient', 'name roomNumber bedNumber')
      .populate('createdBy', 'name');

    if (!dietChart) {
      return res.status(404).json({
        success: false,
        message: 'Diet chart not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dietChart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new diet chart
// @route   POST /api/v1/diet-charts
// @access  Private (Manager Only)
exports.createDietChart = async (req, res) => {
  try {
    // Add logged in user as creator
    req.body.createdBy = req.user.id;

    const dietChart = await DietChart.create(req.body);

    res.status(201).json({
      success: true,
      data: dietChart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update diet chart
// @route   PUT /api/v1/diet-charts/:id
// @access  Private (Manager Only)
exports.updateDietChart = async (req, res) => {
  try {
    const dietChart = await DietChart.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!dietChart) {
      return res.status(404).json({
        success: false,
        message: 'Diet chart not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dietChart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete diet chart
// @route   DELETE /api/v1/diet-charts/:id
// @access  Private (Manager Only)
exports.deleteDietChart = async (req, res) => {
  try {
    const dietChart = await DietChart.findByIdAndDelete(req.params.id);

    if (!dietChart) {
      return res.status(404).json({
        success: false,
        message: 'Diet chart not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 