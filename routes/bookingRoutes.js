const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { 
  bookActivity, 
  getMyBookings, 
  cancelBooking 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');


router.get('/', protect, getMyBookings);


router.post(
  '/',
  [
    protect,
    check('activityId', 'Activity ID is required').not().isEmpty()
  ],
  bookActivity
);

router.put('/:id', protect, cancelBooking);

module.exports = router;