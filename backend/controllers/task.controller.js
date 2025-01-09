const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private (Manager)
exports.getTasks = async (req, res) => {
  try {
    // First verify if we can get user data
    console.log('Fetching tasks with populated data...');

    const tasks = await Task.find()
      .populate({
        path: 'assignedTo',
        model: 'User',
        select: 'name email'
      })
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .lean();

    console.log('Raw tasks from DB:', JSON.stringify(tasks, null, 2));

    // Transform with more detailed logging
    const transformedTasks = tasks.map(task => {
      console.log('Processing task:', task._id);
      console.log('AssignedTo data:', task.assignedTo);

      return {
        _id: task._id,
        description: task.description,
        type: task.type,
        assignedTo: task.assignedTo ? {
          _id: task.assignedTo._id.toString(),
          name: task.assignedTo.name
        } : null,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        notes: task.notes,
        deliveryLocation: task.deliveryLocation,
        createdAt: task.createdAt
      };
    });

    console.log('Transformed tasks:', JSON.stringify(transformedTasks, null, 2));

    res.json({
      success: true,
      data: transformedTasks
    });
  } catch (error) {
    console.error('Error in getTasks:', error);
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
    console.log('Received task data:', JSON.stringify(req.body, null, 2));

    const {
      description,
      type,
      assignedTo,
      dueDate,
      priority,
      notes,
      deliveryLocation
    } = req.body;

    // Log the deliveryLocation specifically
    console.log('DeliveryLocation data:', deliveryLocation);
    console.log('Task type:', type);

    const taskData = {
      description,
      type,
      assignedTo: assignedTo || null,
      dueDate,
      priority,
      notes,
      deliveryLocation: type === 'delivery' ? deliveryLocation : undefined,
      createdBy: req.user._id
    };

    // Log the final data being saved
    console.log('Data being saved to DB:', JSON.stringify(taskData, null, 2));

    const task = await Task.create(taskData);

    // Log the saved task
    console.log('Saved task in DB:', JSON.stringify(task.toObject(), null, 2));

    // Populate the assigned staff details
    await task.populate([
      {
        path: 'assignedTo',
        select: 'name email'
      },
      {
        path: 'createdBy',
        select: 'name'
      }
    ]);

    const transformedTask = {
      _id: task._id,
      description: task.description,
      type: task.type,
      assignedTo: task.assignedTo ? {
        _id: task.assignedTo._id,
        name: task.assignedTo.name
      } : null,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      notes: task.notes,
      deliveryLocation: task.deliveryLocation,
      createdAt: task.createdAt
    };

    res.status(201).json({
      success: true,
      data: transformedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 