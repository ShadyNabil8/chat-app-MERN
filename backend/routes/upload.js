const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const uploadController = require('../controllers/upload')

router.post('/', upload.single('profilePicture'), uploadController.upload)

module.exports = router;