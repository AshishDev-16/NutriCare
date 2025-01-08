const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  dietChart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DietChart',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    enum: ['morning', 'evening', 'night'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivering', 'delivered'],
    default: 'pending'
  },
  preparationTime: Date,
  deliveryTime: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Meal', mealSchema); 