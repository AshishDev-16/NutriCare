const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient
} = require('../controllers/patient.controller');

router.use(protect);
router.use(authorize('manager'));

router
  .route('/')
  .get(getPatients)
  .post(createPatient);

router
  .route('/:id')
  .put(updatePatient)
  .delete(deletePatient);

module.exports = router; 