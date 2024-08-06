const asynchandler = require('express-async-handler')
const chatModel = require('../models/chat')
const userModel = require('../models/User')
const messageModel = require('../models/message')

const create = asynchandler(async (req, res) => {
    const { receiverId, body } = req.body;
    const senderId = req.user;

    if (!receiverId || !senderId) {
        return res.status(400).json({
            success: false,
            error: {
                cause: 'Wrong parameters',
                data: `Receiver or sender ID isn't valid`
            }
        })
    }

    const chatRecord = chatModel({})

    const messageRecord = messageModel({
        senderId: senderId,
        chatId: chatRecord._id,
        body,
        sentAt: new Date()
    })

    chatRecord.participants = [receiverId, senderId];
    chatRecord.lastMessage = messageRecord._id;

    await Promise.all([
        chatRecord.save(),
        messageRecord.save(),
    ]);

    const receiverRecord = await userModel.findById(receiverId, 'displayedName profilePicture')
    console.log(chatRecord._id);
    
    return res.status(200).json({
        success: true,
        data: {
            chatId: chatRecord._id,
            receiverRecord,
            lastMessageRecord: messageRecord
        }
    })
})

const list = asynchandler(async (req, res) => {

    const chatsRecord = await chatModel.find({ participants: req.user })
        .populate({
            path: 'participants',
            select: 'displayedName profilePicture',
            match: { _id: { $ne: req.user } }
        })
        .populate('lastMessage', 'body sentAt');

    return res.status(200).json({
        success: true,
        data: chatsRecord
    })
})

module.exports = { create, list }