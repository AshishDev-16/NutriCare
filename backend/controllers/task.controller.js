const Task = require('../models/Task');
const PantryStaff = require('../models/PantryStaff');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private (Manager)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email location status')
      .populate('createdBy', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      data: tasks || []
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private (Manager)
exports.createTask = async (req, res) => {
  try {
    const {
      description,
      type,
      assignedTo,
      dueDate,
      priority,
      notes,
      deliveryLocation
    } = req.body;

    // Create task
    const task = await Task.create({
      description,
      type,
      assignedTo: assignedTo || null,
      dueDate,
      priority,
      notes,
      deliveryLocation: type === 'delivery' ? deliveryLocation : undefined,
      createdBy: req.user._id
    });

    // If staff is assigned, update their currentTasks
    if (assignedTo) {
      await PantryStaff.findByIdAndUpdate(assignedTo, {
        $push: { currentTasks: task._id },
        status: 'busy'
      });
    }

    // Populate the assigned staff details
    await task.populate([
      {
        path: 'assignedTo',
        select: 'name email location status'
      },
      {
        path: 'createdBy',
        select: 'name'
      }
    ]);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 