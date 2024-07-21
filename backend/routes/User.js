const express = require('express')
const router = express.Router()
const userController = require('../controllers/User')

router.post('/create', userController.create)
router.get('/verify-email', userController.verifyEmail)

module.exports = router;