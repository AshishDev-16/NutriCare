const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patient.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .get(protect, getPatients)
  .post(protect, authorize('manager'), createPatient);

router
  .route('/:id')
  .get(protect, getPatient)
  .put(protect, authorize('manager'), updatePatient)
  .delete(protect, authorize('manager'), deletePatient);

module.exports = router; 