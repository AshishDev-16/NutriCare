const Pantry = require('../models/Pantry');
const User = require('../models/User');
const PantryStaff = require('../models/PantryStaff');

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

exports.getPantryStaff = async (req, res) => {
  try {
    const pantryStaff = await PantryStaff.find()
      .populate({
        path: 'user',
        select: 'name email role'
      })
      .sort('-createdAt');

    console.log('Found pantry staff:', pantryStaff); // Debug log

    const transformedData = pantryStaff.map(staff => ({
      _id: staff._id,
      name: staff.user.name,
      email: staff.user.email,
      contactNumber: staff.contactNumber,
      location: staff.location,
      status: staff.status
    }));

    console.log('Transformed data:', transformedData); // Debug log

    res.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Error fetching pantry staff:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createPantryStaff = async (req, res) => {
  try {
    console.log('Creating pantry staff with data:', req.body);

    const { name, email, contactNumber, floor, wing } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      console.log('Existing user found:', existingUser);
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user with pantry_staff role
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: contactNumber, // Using contact number as initial password
      role: 'pantry_staff'
    });

    console.log('Created user:', user); // Debug log

    // Create pantry staff record
    const pantryStaff = await PantryStaff.create({
      user: user._id,
      contactNumber,
      location: {
        floor,
        wing
      }
    });

    // Populate with full user details
    await pantryStaff.populate({
      path: 'user',
      select: 'name email role'
    });

    console.log('Created pantry staff with populated user:', pantryStaff); // Debug log

    // Return transformed data
    res.status(201).json({
      success: true,
      data: {
        _id: pantryStaff._id,
        name: user.name,
        email: user.email,
        contactNumber: pantryStaff.contactNumber,
        location: pantryStaff.location,
        status: pantryStaff.status
      }
    });
  } catch (error) {
    console.error('Error in createPantryStaff:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePantryStaff = async (req, res) => {
  try {
    const { name, email, contactNumber, floor, wing } = req.body;
    console.log('Update request body:', req.body); // Debug log

    // First find the pantry staff
    const pantryStaff = await PantryStaff.findById(req.params.id);
    if (!pantryStaff) {
      return res.status(404).json({
        success: false,
        message: 'Pantry staff not found'
      });
    }

    // Update user details
    await User.findByIdAndUpdate(pantryStaff.user, {
      name,
      email
    });

    // Update pantry staff details with location
    const updatedPantryStaff = await PantryStaff.findByIdAndUpdate(
      req.params.id,
      {
        contactNumber,
        location: {
          floor: floor || '',
          wing: wing || ''
        }
      },
      { new: true }
    ).populate('user', 'name email');

    console.log('Updated staff:', updatedPantryStaff); // Debug log

    const responseData = {
      _id: updatedPantryStaff._id,
      name: updatedPantryStaff.user.name,
      email: updatedPantryStaff.user.email,
      contactNumber: updatedPantryStaff.contactNumber,
      location: updatedPantryStaff.location,
      status: updatedPantryStaff.status
    };

    console.log('Response data:', responseData); // Debug log

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error updating pantry staff:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePantryStaff = async (req, res) => {
  try {
    // Find pantry staff first
    const pantryStaff = await PantryStaff.findById(req.params.id);

    if (!pantryStaff) {
      return res.status(404).json({
        success: false,
        message: 'Pantry staff not found'
      });
    }

    // Delete the user first
    await User.findByIdAndDelete(pantryStaff.user);
    
    // Then delete the pantry staff
    await PantryStaff.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Pantry staff deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pantry staff:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 