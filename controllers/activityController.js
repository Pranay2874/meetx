const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
exports.getActivities = async (req, res) => {
  try {
    // Build query
    const query = {};
    
    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by future date if requested
    if (req.query.upcoming === 'true') {
      query.dateTime = { $gte: new Date() };
    }

    // Execute query with optional pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const activities = await Activity.find(query)
      .sort({ dateTime: 1 })
      .skip(startIndex)
      .limit(limit);
    
    const total = await Activity.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: activities
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: err.message 
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    // Check if error is because of invalid ObjectId
    if (err.name === 'CastError') {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: err.message 
    });
  }
};

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private (Admin only, but we'll implement basic auth for now)
exports.createActivity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const activity = await Activity.create(req.body);

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: err.message 
    });
  }
};