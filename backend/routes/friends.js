const express = require('express')
const router = express.Router()
const firendsController = require('../controllers/friends')
const { protect } = require('../utils/auth')

router.get('/list', protect, firendsController.list)
router.post('/delete', protect, firendsController.unfriend)

module.exports = router;