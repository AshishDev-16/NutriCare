const mongoose = require('mongoose');

const pantryStaffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Please add a contact number']
  },
  location: {
    floor: String,
    wing: String
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'off-duty'],
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PantryStaff', pantryStaffSchema); 