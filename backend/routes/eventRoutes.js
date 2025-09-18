const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventAnalytics } = require('../controllers/eventController');
const { protect } = require('./middleware/auth');

router.get('/', getEvents);

router.post('/', protect, createEvent);

router.get('/:id/analytics', protect, getEventAnalytics);

module.exports = router;

