const asynchandler = require('express-async-handler')
const chatModel = require('../models/chat')
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
        sender: senderId,
        chat: chatRecord._id,
        body
    })

    chatRecord.participants = [receiverId, senderId];
    chatRecord.lastMessage = messageRecord._id;

    await Promise.all([
        chatRecord.save(),
        messageRecord.save(),
    ]);

    // console.log(chatRecord);
    // console.log(messageRecord);

    return res.status(200).json({
        success: true,
        data: {
            createdChat: chatRecord._id,
            lastMeaagse: messageRecord.body
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
        .populate('lastMessage', 'body');

    console.log(chatsRecord);

    return res.status(200).json({
        success: true,
        data: chatsRecord
    })
})

module.exports = { create, list }