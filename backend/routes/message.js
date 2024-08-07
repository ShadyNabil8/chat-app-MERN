const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message')
const { protect } = require('../utils/auth')

router.get('/list', protect, messageController.list)

module.exports = router;
