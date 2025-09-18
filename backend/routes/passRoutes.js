const express = require('express');
const router = express.Router();
const { generatePass, verifyPass } = require('../controllers/passController');
const { protect } = require('./middleware/auth');

router.post('/generate', generatePass);

router.post('/verify', protect, verifyPass);

module.exports = router;

