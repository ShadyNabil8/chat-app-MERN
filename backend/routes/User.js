const express = require('express')
const router = express.Router()
const userController = require('../controllers/User')
const { protect } = require('../utils/auth')

router.post('/register', userController.register)
router.get('/verify-email', userController.verifyEmail)
router.post('/login', protect, userController.login)

module.exports = router;