const Task = require('../models/Task');
const Meal = require('../models/Meal');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    // If user is not manager, only show their assigned tasks
    const query = req.user.role === 'manager' 
      ? {} 
      : { assignedTo: req.user.id };

    const tasks = await Task.find(query)
      .populate('meal', 'type status')
      .populate('assignedTo', 'name')
      .populate('pantry', 'name location')
      .populate({
        path: 'meal',
        populate: {
          path: 'patient',
          select: 'name roomNumber bedNumber'
        }
      });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('meal', 'type status')
      .populate('assignedTo', 'name')
      .populate('pantry', 'name location')
      .populate({
        path: 'meal',
        populate: {
          path: 'patient',
          select: 'name roomNumber bedNumber'
        }
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to this task
    if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private (Manager Only)
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    // Update meal status if task is created
    if (task.meal) {
      await Meal.findByIdAndUpdate(task.meal, {
        status: 'preparing',
        assignedTo: task.assignedTo
      });
    }

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update task status
// @route   PUT /api/v1/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { 
      status,
      updatedAt: Date.now()
    };

    // Add timestamps based on status
    if (status === 'in-progress') {
      updates.startTime = Date.now();
    } else if (status === 'completed') {
      updates.completionTime = Date.now();
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is assigned to this task
    if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    // Update meal status based on task status
    if (task.meal) {
      let mealStatus = 'preparing';
      if (status === 'completed') {
        mealStatus = 'delivered';
      } else if (status === 'in-progress') {
        mealStatus = 'delivering';
      }

      await Meal.findByIdAndUpdate(task.meal, { status: mealStatus });
    }

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get tasks by priority
// @route   GET /api/v1/tasks/priority/:priority
// @access  Private
exports.getTasksByPriority = async (req, res) => {
  try {
    const query = {
      priority: req.params.priority
    };

    // If not manager, only show assigned tasks
    if (req.user.role !== 'manager') {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate('meal', 'type status')
      .populate('assignedTo', 'name')
      .populate('pantry', 'name location');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 