const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notification')
const { protect } = require('../utils/auth')

router.get('/list', protect, notificationController.list)

module.exports = router;