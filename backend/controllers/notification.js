const asynchandler = require('express-async-handler')
const notificationModel = require('../models/notification')
const userModel = require('../models/User')

const list = asynchandler(async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            success: false,
            error: {
                cause: 'Wrong query parameters',
                data: `User ID isn't valid`
            }
        })
    }

    const notifications = await notificationModel.find({ receiver: userId }).populate('requester', 'displayedName profilePicture')

    return res.status(200).json({
        success: true,
        data: notifications
    })

})

const action = asynchandler(async (req, res) => {
    const { notificationId, action } = req.body;

    if (!notificationId || !action) {
        return res.status(400).json({
            success: false,
            error: {
                cause: 'Wrong parameters',
                data: `Notification ID or action isn't valid`
            }
        })
    }

    const notificationRecord = await notificationModel.findById(notificationId)

    if (!notificationRecord) {
        return res.status(404).json({
            success: false,
            error: {
                cause: 'Not found',
                data: 'Notification not found'
            }
        })
    }

    if (action === 'confirm') {
        const { receiver, requester } = notificationRecord;

        const [receiverRecord, requesterRecord] = await Promise.all([
            userModel.findById(receiver),
            userModel.findById(requester)
        ]);

        if (!receiverRecord || !requesterRecord) {
            return res.status(404).json({
                success: false,
                error: {
                    cause: 'Not found',
                    data: 'Requester or receiver not found'
                }
            });
        }

        receiverRecord.friends.push(requester);
        requesterRecord.friends.push(receiver);

        await Promise.all([
            receiverRecord.save(),
            requesterRecord.save()

        ])
    }

    await notificationRecord.deleteOne();

    return res.status(200).json({
        success: true,
        message: 'Friend request is seccessfully handles'
    })

})

module.exports = { list, action }