const mongoose = require('mongoose');

const dietChartSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  meals: {
    morning: {
      items: [{
        name: String,
        quantity: String,
        instructions: String
      }],
      specialInstructions: String
    },
    evening: {
      items: [{
        name: String,
        quantity: String,
        instructions: String
      }],
      specialInstructions: String
    },
    night: {
      items: [{
        name: String,
        quantity: String,
        instructions: String
      }],
      specialInstructions: String
    }
  },
  dietaryRestrictions: [{
    type: String
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

module.exports = mongoose.model('DietChart', dietChartSchema); 