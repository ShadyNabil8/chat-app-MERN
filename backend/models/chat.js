const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        required: false
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    }

}, { timestamps: true })

module.exports = mongoose.model('chat', schema);