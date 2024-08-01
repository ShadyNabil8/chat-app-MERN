const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notification')
const { protect } = require('../utils/auth')

router.get('/list', protect, notificationController.list)
router.post('/action', protect, notificationController.action)

module.exports = router;