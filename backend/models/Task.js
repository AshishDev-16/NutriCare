const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pantry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pantry',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'assigned'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  startTime: Date,
  completionTime: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to update completionTime when status changes to completed
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completionTime) {
    this.completionTime = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema); 