const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
    readBy: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        readAt: {
            type: Date,
        },
    },

}, { timestamps: true })

module.exports = mongoose.model('message', schema)