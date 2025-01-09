const DietChart = require('../models/DietChart');
const { logActivity } = require('./dashboard.controller');

// @desc    Get all diet charts
// @route   GET /api/v1/diet-charts
// @access  Private (Manager only)
exports.getDietCharts = async (req, res) => {
  try {
    const dietCharts = await DietChart.find()
      .populate({
        path: 'patient',
        select: 'name roomNumber bedNumber'
      })
      .populate({
        path: 'createdBy',
        select: 'name'
      })
      .sort('-createdAt');

    res.json({
      success: true,
      data: dietCharts || []
    });
  } catch (error) {
    console.error('Error fetching diet charts:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new diet chart
// @route   POST /api/v1/diet-charts
// @access  Private (Manager only)
exports.createDietChart = async (req, res) => {
  try {
    // Add the current user as creator
    req.body.createdBy = req.user._id;

    const dietChart = await DietChart.create(req.body);
    await dietChart.populate('patient', 'name');
    await dietChart.populate('createdBy', 'name');

    await logActivity('diet_chart_created', 'New diet chart created', {
      patientName: dietChart.patient.name,
      roomNumber: dietChart.patient.roomNumber,
      staffName: req.user.name
    });

    res.status(201).json({
      success: true,
      data: dietChart
    });
  } catch (error) {
    console.error('Error creating diet chart:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create diet chart'
    });
  }
};

// @desc    Update diet chart
// @route   PUT /api/v1/diet-charts/:id
// @access  Private (Manager only)
exports.updateDietChart = async (req, res) => {
  try {
    const dietChart = await DietChart.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('patient', 'name')
    .populate('createdBy', 'name');

    if (!dietChart) {
      return res.status(404).json({
        success: false,
        message: 'Diet chart not found'
      });
    }

    res.json({
      success: true,
      data: dietChart
    });
  } catch (error) {
    console.error('Error updating diet chart:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update diet chart'
    });
  }
};

// @desc    Delete diet chart
// @route   DELETE /api/v1/diet-charts/:id
// @access  Private (Manager only)
exports.deleteDietChart = async (req, res) => {
  try {
    const dietChart = await DietChart.findByIdAndDelete(req.params.id);

    if (!dietChart) {
      return res.status(404).json({
        success: false,
        message: 'Diet chart not found'
      });
    }

    res.json({
      success: true,
      message: 'Diet chart deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting diet chart:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete diet chart'
    });
  }
}; 