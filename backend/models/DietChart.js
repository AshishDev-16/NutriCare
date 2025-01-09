const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: String,
  instructions: String
});

const mealSchema = new mongoose.Schema({
  items: [mealItemSchema],
  specialInstructions: String
});

const dietChartSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DietChart', dietChartSchema);