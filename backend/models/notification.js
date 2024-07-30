const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['friend_request', 'message', 'system_update', 'other']
    },
    content: {
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    metadata: {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
    },
    read: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

module.exports = mongoose.model('notification', schema);