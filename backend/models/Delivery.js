const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PantryStaff',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  startTime: Date,
  endTime: Date,
  location: {
    floor: String,
    wing: String,
    roomNumber: String
  },
  notes: String,
  trackingUpdates: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema); 