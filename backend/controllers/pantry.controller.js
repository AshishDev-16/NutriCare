const Pantry = require('../models/Pantry');

// @desc    Get all pantries
// @route   GET /api/v1/pantries
// @access  Private
exports.getPantries = async (req, res) => {
  try {
    const pantries = await Pantry.find()
      .populate('staff', 'name')
      .populate('supervisor', 'name');

    res.status(200).json({
      success: true,
      count: pantries.length,
      data: pantries
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single pantry
// @route   GET /api/v1/pantries/:id
// @access  Private
exports.getPantry = async (req, res) => {
  try {
    const pantry = await Pantry.findById(req.params.id)
      .populate('staff', 'name')
      .populate('supervisor', 'name');

    if (!pantry) {
      return res.status(404).json({
        success: false,
        message: 'Pantry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pantry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new pantry
// @route   POST /api/v1/pantries
// @access  Private (Manager Only)
exports.createPantry = async (req, res) => {
  try {
    const pantry = await Pantry.create(req.body);

    res.status(201).json({
      success: true,
      data: pantry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update pantry
// @route   PUT /api/v1/pantries/:id
// @access  Private (Manager Only)
exports.updatePantry = async (req, res) => {
  try {
    const pantry = await Pantry.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!pantry) {
      return res.status(404).json({
        success: false,
        message: 'Pantry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pantry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add staff to pantry
// @route   PUT /api/v1/pantries/:id/staff
// @access  Private (Manager Only)
exports.addStaffToPantry = async (req, res) => {
  try {
    const { staffId } = req.body;
    const pantry = await Pantry.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { staff: staffId } // $addToSet prevents duplicate staff entries
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!pantry) {
      return res.status(404).json({
        success: false,
        message: 'Pantry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pantry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove staff from pantry
// @route   DELETE /api/v1/pantries/:id/staff/:staffId
// @access  Private (Manager Only)
exports.removeStaffFromPantry = async (req, res) => {
  try {
    const pantry = await Pantry.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { staff: req.params.staffId }
      },
      {
        new: true
      }
    );

    if (!pantry) {
      return res.status(404).json({
        success: false,
        message: 'Pantry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pantry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 