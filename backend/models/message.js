const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sentAt: {
        type: Data,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
    readBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        readAt: {
            type: Data,
        },
    },

})

module.exports = mongoose.model('message', schema)