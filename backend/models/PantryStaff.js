const mongoose = require('mongoose');

const pantryStaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contactNumber: {
    type: String,
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
  status: {
    type: String,
    enum: ['available', 'busy', 'off-duty'],
    default: 'available'
  },
  currentTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PantryStaff', pantryStaffSchema); 