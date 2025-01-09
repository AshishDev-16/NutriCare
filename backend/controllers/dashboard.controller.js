const Patient = require('../models/Patient');
const DietChart = require('../models/DietChart');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const PantryStaff = require('../models/PantryStaff');

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
      pendingDeliveries,
      recentDietCharts
    ] = await Promise.all([
      Patient.countDocuments(),
      DietChart.countDocuments({ status: 'active' }),
      Task.countDocuments({ status: 'completed' }),
      Task.countDocuments({ type: 'delivery', status: 'pending' }),
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
        pendingDeliveries,
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

// @desc    Get delivery trends
// @route   GET /api/v1/dashboard/trends
// @access  Private
exports.getDeliveryTrends = async (req, res) => {
  try {
    // Get last 7 days of delivery data
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const deliveryTrends = await Task.aggregate([
      {
        $match: {
          type: 'delivery',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          deliveries: { $sum: 1 },
          onTime: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
            }
          },
          delayed: {
            $sum: {
              $cond: [{ $eq: ["$status", "delayed"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          deliveries: 1,
          onTime: 1,
          delayed: 1
        }
      },
      { $sort: { date: 1 } }
    ])

    res.json({
      success: true,
      data: deliveryTrends
    })
  } catch (error) {
    console.error('Error fetching delivery trends:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch delivery trends'
    })
  }
}

// @desc    Get delivery schedule
// @route   GET /api/v1/dashboard/schedule
// @access  Private
exports.getDeliverySchedule = async (req, res) => {
  try {
    const { date } = req.query
    const queryDate = date ? new Date(date) : new Date()
    
    // Set time to start of day
    queryDate.setHours(0, 0, 0, 0)
    const nextDay = new Date(queryDate)
    nextDay.setDate(queryDate.getDate() + 1)

    const schedules = await Task.find({
      type: 'delivery',
      scheduledFor: {
        $gte: queryDate,
        $lt: nextDay
      }
    })
    .populate('patient', 'name roomNumber')
    .sort('scheduledFor')
    .lean()

    const formattedSchedules = schedules.map(schedule => ({
      id: schedule._id,
      patientName: schedule.patient.name,
      roomNumber: schedule.patient.roomNumber,
      mealType: schedule.mealType,
      time: schedule.scheduledFor.toLocaleTimeString(),
      status: schedule.status
    }))

    res.json({
      success: true,
      data: formattedSchedules
    })
  } catch (error) {
    console.error('Error fetching delivery schedule:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch delivery schedule'
    })
  }
}

// @desc    Get recent activities
// @route   GET /api/v1/dashboard/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort('-timestamp')
      .limit(20)
      .lean();

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch activities'
    });
  }
};

// Helper function to log activities
exports.logActivity = async (type, message, meta = {}) => {
  try {
    await Activity.create({
      type,
      message,
      meta
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// @desc    Get meal status for all patients
// @route   GET /api/v1/dashboard/meal-status
// @access  Private
exports.getMealStatus = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get all active diet charts for today
    const dietCharts = await DietChart.find({
      status: 'active',
      startDate: { $lte: today },
      endDate: { $gte: today }
    })
    .populate('patient', 'name roomNumber')
    .lean()

    // Get all delivery tasks for today
    const deliveryTasks = await Task.find({
      type: 'delivery',
      scheduledFor: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).lean()

    // Format the response
    const mealStatus = dietCharts.map(chart => {
      const morningDelivery = deliveryTasks.find(
        task => task.dietChart?.toString() === chart._id.toString() && 
        task.mealType === 'morning'
      )
      
      const eveningDelivery = deliveryTasks.find(
        task => task.dietChart?.toString() === chart._id.toString() && 
        task.mealType === 'evening'
      )

      return {
        patientId: chart.patient._id,
        patientName: chart.patient.name,
        roomNumber: chart.patient.roomNumber,
        morningMeal: {
          status: morningDelivery?.status || 
            (chart.meals.morning.items.length > 0 ? 'pending' : 'none'),
          items: chart.meals.morning.items
        },
        eveningMeal: {
          status: eveningDelivery?.status || 
            (chart.meals.evening.items.length > 0 ? 'pending' : 'none'),
          items: chart.meals.evening.items
        }
      }
    })

    res.json({
      success: true,
      data: mealStatus
    })
  } catch (error) {
    console.error('Error fetching meal status:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch meal status'
    })
  }
}

// @desc    Get staff performance metrics
// @route   GET /api/v1/dashboard/staff-metrics
// @access  Private
exports.getStaffMetrics = async (req, res) => {
  try {
    // First get all staff who have been assigned delivery tasks
    const deliveryStaffIds = await Task.distinct('assignedTo', { 
      type: 'delivery'
    });

    console.log('Staff IDs with delivery tasks:', deliveryStaffIds);

    // Get the staff details
    const deliveryStaff = await PantryStaff.find({ 
      _id: { $in: deliveryStaffIds },
      status: 'active'
    })
    .select('name email phoneNumber')
    .lean();

    console.log('Found delivery staff:', deliveryStaff);

    if (deliveryStaff.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Get metrics for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const staffMetrics = await Promise.all(
      deliveryStaff.map(async (staff) => {
        // Get all delivery tasks assigned to this staff member
        const tasks = await Task.find({
          assignedTo: staff._id,
          type: 'delivery',
          createdAt: { $gte: thirtyDaysAgo }
        }).lean();

        console.log(`Tasks for staff ${staff.name}:`, tasks.length);

        // Calculate metrics
        const completedDeliveries = tasks.filter(task => task.status === 'completed');
        const onTimeDeliveries = completedDeliveries.filter(task => {
          const deliveryTime = new Date(task.completionTime) - new Date(task.scheduledFor);
          return deliveryTime <= 15 * 60 * 1000; // 15 minutes in milliseconds
        });

        // Calculate average delivery time
        const deliveryTimes = completedDeliveries.map(task => 
          new Date(task.completionTime) - new Date(task.scheduledFor)
        );
        const averageTime = deliveryTimes.length > 0 
          ? Math.round(deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length / 60000) // Convert to minutes
          : 0;

        // Get recent performance (last 7 days)
        const recentPerformance = await Task.aggregate([
          {
            $match: {
              assignedTo: staff._id,
              type: 'delivery',
              createdAt: { 
                $gte: new Date(new Date().setDate(new Date().getDate() - 7)) 
              }
            }
          },
          {
            $group: {
              _id: { 
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
              },
              deliveries: { $sum: 1 },
              onTime: {
                $sum: {
                  $cond: [
                    { 
                      $lte: [
                        { $subtract: ["$completionTime", "$scheduledFor"] },
                        900000 // 15 minutes in milliseconds
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              date: "$_id",
              deliveries: 1,
              onTime: 1
            }
          },
          { $sort: { date: 1 } }
        ]);

        return {
          staffId: staff._id,
          name: staff.name,
          email: staff.email,
          phoneNumber: staff.phoneNumber,
          metrics: {
            totalDeliveries: tasks.length,
            completedDeliveries: completedDeliveries.length,
            onTimeDeliveries: onTimeDeliveries.length,
            totalTasks: tasks.length,
            completedTasks: completedDeliveries.length,
            averageDeliveryTime: averageTime
          },
          recentPerformance
        };
      })
    );

    // Sort staff by performance (completion rate)
    const sortedStaffMetrics = staffMetrics.sort((a, b) => {
      const aCompletionRate = (a.metrics.completedDeliveries / a.metrics.totalDeliveries) || 0;
      const bCompletionRate = (b.metrics.completedDeliveries / b.metrics.totalDeliveries) || 0;
      return bCompletionRate - aCompletionRate;
    });

    res.json({
      success: true,
      data: sortedStaffMetrics
    });
  } catch (error) {
    console.error('Error fetching staff metrics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch staff metrics'
    });
  }
}; 