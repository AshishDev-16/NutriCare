const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add patient name'],
    trim: true
  },
  diseases: [{
    type: String,
    required: true
  }],
  allergies: [{
    type: String
  }],
  roomNumber: {
    type: String,
    required: [true, 'Please add room number']
  },
  bedNumber: {
    type: String,
    required: [true, 'Please add bed number']
  },
  floorNumber: {
    type: String,
    required: [true, 'Please add floor number']
  },
  age: {
    type: Number,
    required: [true, 'Please add age']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Please specify gender']
  },
  contactNumber: {
    type: String,
    required: [true, 'Please add contact number']
  },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
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

module.exports = mongoose.model('Patient', patientSchema); 