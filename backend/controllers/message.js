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
                from: 'users',          
                localField: 'senderId', 
                foreignField: '_id',    
                as: 'senderDetails'     
            }
        },
        {
            $unwind: '$senderDetails'          
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