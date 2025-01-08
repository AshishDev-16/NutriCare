const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required']
  },
  bedNumber: {
    type: String,
    required: [true, 'Bed number is required']
  },
  floorNumber: {
    type: String,
    required: [true, 'Floor number is required']
  },
  diseases: [{
    type: String,
    trim: true
  }],
  allergies: [{
    type: String,
    trim: true
  }],
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relation: {
      type: String,
      required: [true, 'Emergency contact relation is required']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', patientSchema); 