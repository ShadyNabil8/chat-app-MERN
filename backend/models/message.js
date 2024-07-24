const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    body: {
        type: String,
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
            type: Date,
        },
    },

}, { timestamps: true })

module.exports = mongoose.model('message', schema)