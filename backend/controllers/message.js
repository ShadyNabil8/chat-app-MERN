const asynchandler = require('express-async-handler')
const messageModel = require('../models/message')
const mongoose = require('mongoose')
const list = asynchandler(async (req, res) => {
    const { limit, skip, chatId } = req.query;
    console.log(req.user);

    const messagesRecord = await messageModel.aggregate([
        {
            $match: { chatId: new mongoose.Types.ObjectId(chatId) }
        },
        {
            $lookup: {
                from: 'users',                // The collection to join
                localField: 'senderId',       // Field from the message collection
                foreignField: '_id',          // Field from the user collection
                as: 'senderDetails'           // Name of the new array field to add
            }
        },
        {
            $unwind: '$senderDetails'          // Deconstruct the array field
        },
        {
            $addFields: {
                myMessage: {
                    $cond: {
                        if: { $eq: ['$senderId', new mongoose.Types.ObjectId(req.user)] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                body: 1,
                sentAt: 1,
                myMessage: 1,
                senderProfilePicture: "$senderDetails.profilePicture",
            }
        },
        {
            $sort: { sentAt: -1 }
        },
        {
            $skip: parseInt(skip),
        },
        {
            $limit: parseInt(limit)

        }
    ])
    
    res.status(200).json({
        success: true,
        data: messagesRecord
    })
})

module.exports = { list }