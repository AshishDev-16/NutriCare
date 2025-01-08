const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add pantry name'],
    unique: true
  },
  location: {
    floor: String,
    wing: String
  },
  staff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
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

module.exports = mongoose.model('Pantry', pantrySchema); 