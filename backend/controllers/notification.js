const asynchandler = require('express-async-handler')
const notificationModel = require('../models/notification')

const list = asynchandler(async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        res.status(400).json({
            success: false,
            error: {
                cause: 'Wrong query parameters',
                data: `User ID isn't valid`
            }
        })
    }

    const notifications = await notificationModel.find({ receiver: userId }).populate('requester','displayedName profilePicture')

    console.log(notifications);

    res.status(200).json({
        success: true,
        data: notifications
    })

})

module.exports = { list }