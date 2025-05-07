const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { 
  getActivities, 
  getActivity, 
  createActivity 
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');


router.get('/', getActivities);


router.get('/:id', getActivity);

router.post(
  '/',
  [
    protect,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('dateTime', 'Date and time are required').not().isEmpty(),
    check('capacity', 'Capacity is required').isNumeric(),
    check('price', 'Price is required').isNumeric(),
    check('category', 'Category is required').not().isEmpty()
  ],
  createActivity
);

module.exports = router;