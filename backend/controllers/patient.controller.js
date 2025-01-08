const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/v1/patients
// @access  Private
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single patient
// @route   GET /api/v1/patients/:id
// @access  Private
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new patient
// @route   POST /api/v1/patients
// @access  Private
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update patient
// @route   PUT /api/v1/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete patient
// @route   DELETE /api/v1/patients/:id
// @access  Private
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 