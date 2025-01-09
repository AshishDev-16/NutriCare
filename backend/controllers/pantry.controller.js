const Task = require('../models/Task');
const PantryStaff = require('../models/PantryStaff');

// @desc    Get all tasks for pantry staff
// @route   GET /api/v1/pantry/tasks
// @access  Private (Pantry Staff only)
exports.getTasks = async (req, res) => {
  try {
    const { type } = req.query;
    console.log('Query Type:', type);

    let query = {};
    
    if (type) {
      query.type = type;
    }

    // Don't filter out completed tasks - we want to see them in history
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name')
      .sort({ updatedAt: -1 }) // Sort by most recent first
      .lean();

    const formattedTasks = tasks.map(task => ({
      _id: task._id,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedTo: {
        name: task.assignedTo?.name || 'Unassigned'
      },
      type: task.type,
      notes: task.notes || '',
      roomNumber: task.roomNumber,
      patientName: task.patientName,
      deliveryLocation: task.deliveryLocation,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));

    res.json({
      success: true,
      data: formattedTasks
    });
  } catch (error) {
    console.error('Error fetching pantry tasks:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tasks'
    });
  }
};

// @desc    Update task status
// @route   PATCH /api/v1/pantry/tasks/:id/status
// @access  Private (Pantry Staff only)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'completed' ? { completionTime: Date.now() } : {})
      },
      { new: true }
    ).populate('assignedTo', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task status'
    });
  }
};

// Existing staff management functions
exports.getPantryStaff = async (req, res) => {
  try {
    const pantryStaff = await PantryStaff.find().sort('-createdAt');
    res.json({
      success: true,
      data: pantryStaff
    });
  } catch (error) {
    console.error('Error fetching pantry staff:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createPantryStaff = async (req, res) => {
  try {
    const { name, email, contactNumber, floor, wing } = req.body;
    const pantryStaff = await PantryStaff.create({
      name,
      email,
      contactNumber,
      location: {
        floor,
        wing
      },
      status: 'available'
    });

    res.status(201).json({
      success: true,
      data: pantryStaff
    });
  } catch (error) {
    console.error('Error creating pantry staff:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePantryStaff = async (req, res) => {
  try {
    const { name, email, contactNumber, floor, wing } = req.body;
    const updatedPantryStaff = await PantryStaff.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        contactNumber,
        location: {
          floor,
          wing
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedPantryStaff) {
      return res.status(404).json({
        success: false,
        message: 'Pantry staff not found'
      });
    }

    res.json({
      success: true,
      data: updatedPantryStaff
    });
  } catch (error) {
    console.error('Error updating pantry staff:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePantryStaff = async (req, res) => {
  try {
    const pantryStaff = await PantryStaff.findById(req.params.id);
    if (!pantryStaff) {
      return res.status(404).json({
        success: false,
        message: 'Pantry staff not found'
      });
    }
    await PantryStaff.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Pantry staff deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pantry staff:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a test task (temporary)
// @route   POST /api/v1/pantry/tasks/test
// @access  Private
exports.createTestTask = async (req, res) => {
  try {
    const task = await Task.create({
      description: "Test preparation task",
      type: "preparation",
      status: "pending",
      priority: "high",
      scheduledFor: new Date(),
      assignedTo: req.user._id
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error creating test task:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 