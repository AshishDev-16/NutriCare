const Patient = require('../models/Patient');
const DietChart = require('../models/DietChart');
const Task = require('../models/Task');

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard
// @access  Private (Manager only)
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalPatients, 
      activeDietCharts, 
      completedTasks,
      recentDietCharts
    ] = await Promise.all([
      Patient.countDocuments(),
      DietChart.countDocuments({ status: 'active' }),
      Task.countDocuments({ status: 'completed' }),
      DietChart.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('patient', 'name roomNumber bedNumber')
    ]);

    // Get today's completed tasks
    const todaysCompletedTasks = await Task.countDocuments({
      status: 'completed',
      completionTime: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Calculate today's meals
    const todaysDietCharts = await DietChart.find({
      status: 'active',
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    const todaysMeals = todaysDietCharts.length;
    const todaysMorningMeals = todaysDietCharts.filter(chart => chart.meals.morning.items.length > 0).length;
    const todayEveningMeals = todaysDietCharts.filter(chart => chart.meals.evening.items.length > 0).length;

    res.json({
      success: true,
      data: {
        totalPatients,
        activeDietCharts,
        completedTasks,
        todaysCompletedTasks,
        todaysMeals,
        pendingDeliveries: 0,
        recentDietCharts,
        todaysMorningMeals,
        todayEveningMeals
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard statistics'
    });
  }
}; 