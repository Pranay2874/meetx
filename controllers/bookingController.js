const Booking = require('../models/Booking');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');

// @desc    Book an activity
// @route   POST /api/bookings
// @access  Private
exports.bookActivity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { activityId } = req.body;

    // Check if activity exists
    const activity = await Activity.findById(activityId);
    
    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }
    
    // Check if activity date has passed
    if (new Date(activity.dateTime) < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot book past activities' 
      });
    }

    // Check if user already booked this activity
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      activity: activityId
    });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already booked this activity' 
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      activity: activityId
    });

    // Populate activity details in response
    await booking.populate('activity');

    res.status(201).json({
      success: true,
      data: booking
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

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'activity',
        select: 'title description location dateTime price category'
      })
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: err.message 
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this booking' 
      });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    // Check if error is because of invalid ObjectId
    if (err.name === 'CastError') {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: err.message 
    });
  }
};