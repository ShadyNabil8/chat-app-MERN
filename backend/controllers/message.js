const asynchandler = require('express-async-handler')
const messageModel = require('../models/message')

const list = asynchandler(async (req, res) => {
    const { limit, skip, chatId } = req.query;

    const messagesRecord = await messageModel.find({ chatId: chatId })
        .populate('senderId', 'profilePicture')
        .sort({ sentAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit));


    res.status(200).json({
        success: true,
        data: messagesRecord
    })
})

module.exports = { list }