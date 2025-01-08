const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required']
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required']
  },
  instructions: {
    type: String
  }
});

const mealSchema = new mongoose.Schema({
  items: [mealItemSchema],
  specialInstructions: String
});

const dietChartSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  meals: {
    morning: mealSchema,
    evening: mealSchema
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DietChart', dietChartSchema); 