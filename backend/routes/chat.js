const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chat')
const { protect } = require('../utils/auth')

router.post('/create', protect, chatController.create)

module.exports = router;