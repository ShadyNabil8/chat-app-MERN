const express = require('express')
const router = express.Router()
const userController = require('../controllers/User')

router.post('/register', userController.register)
router.get('/verify-email', userController.verifyEmail)
router.get('/login', userController.login)

module.exports = router;