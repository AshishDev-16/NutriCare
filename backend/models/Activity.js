const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['diet_chart_created', 'delivery_completed', 'delivery_delayed', 'task_completed', 'task_assigned'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  meta: {
    patientName: String,
    roomNumber: String,
    staffName: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema); 