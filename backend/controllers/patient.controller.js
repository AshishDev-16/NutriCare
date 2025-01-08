const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/v1/patients
// @access  Private (Manager only)
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort('-createdAt');

    res.json({
      success: true,
      data: patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch patients'
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
// @access  Private (Manager only)
exports.createPatient = async (req, res) => {
  try {
    console.log('Creating patient with data:', req.body);

    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create patient'
    });
  }
};

// @desc    Update patient
// @route   PUT /api/v1/patients/:id
// @access  Private (Manager only)
exports.updatePatient = async (req, res) => {
  try {
    console.log('Updating patient:', req.params.id, 'with data:', req.body);

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

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update patient'
    });
  }
};

// @desc    Delete patient
// @route   DELETE /api/v1/patients/:id
// @access  Private (Manager only)
exports.deletePatient = async (req, res) => {
  try {
    console.log('Deleting patient:', req.params.id);

    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete patient'
    });
  }
}; 