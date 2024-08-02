const asyncHandler = require('express-async-handler')

const upload = asyncHandler(async (req, res) => {
    return res.json({
        imageUrl: `/uploads/${req.file.filename}`
    })
})

module.exports = { upload }