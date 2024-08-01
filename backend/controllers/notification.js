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

    const notifications = await notificationModel.find({ receiver: userId }).populate('requester', 'displayedName profilePicture')

    res.status(200).json({
        success: true,
        data: notifications
    })

})

const action = asynchandler(async (req, res) => {
    const { notificationId, action } = req.body;

    console.log(notificationId);
    console.log(action);

    if (!notificationId || !action) {
        res.status(400).json({
            success: false,
            error: {
                cause: 'Wrong parameters',
                data: `Notification ID or action isn't valid`
            }
        })
    }

    const notificationRecord = await notificationModel.findById(notificationId)

    if (!notificationRecord) {
        res.status(400).json({
            success: false,
            error: {
                cause: 'Wrong parameters',
                data: `Notification ID or action isn't valid`
            }
        })
    }

    if (action === 'confirm') {
        console.log(notificationRecord.requester._id);
        
    }

})

module.exports = { list, action }