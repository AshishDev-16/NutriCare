const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    floor: {
      type: String,
      required: true
    },
    wing: {
      type: String,
      required: true
    }
  },
  contactNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'busy'],
    default: 'available'
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pantry', pantrySchema); 