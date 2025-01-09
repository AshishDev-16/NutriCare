const Task = require('../models/Task');

// @desc    Get all deliveries
// @route   GET /api/v1/deliveries
// @access  Private
exports.getDeliveries = async (req, res) => {
  try {
    const deliveryTasks = await Task.find({ 
      type: 'delivery',
    })
    .populate('assignedTo', 'name email')
    .sort('-createdAt');

    console.log('Fetched delivery tasks:', deliveryTasks);

    res.json({
      success: true,
      data: deliveryTasks
    });
  } catch (error) {
    console.error('Error fetching delivery tasks:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch deliveries'
    });
  }
};

// @desc    Update delivery status
// @route   PUT /api/v1/deliveries/:id/status
// @access  Private
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes: note,
        ...(status === 'in_progress' && { startTime: new Date() }),
        ...(status === 'completed' && { completionTime: new Date() })
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Delivery task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update delivery status'
    });
  }
};

// @desc    Get delivery statistics
// @route   GET /api/v1/deliveries/stats
// @access  Private
exports.getDeliveryStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { type: 'delivery' } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching delivery stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch delivery statistics'
    });
  }
}; 