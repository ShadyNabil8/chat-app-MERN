const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    lastMeaagse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    }

}, { timestamps: true })

module.exports = mongoose.model('chat', schema);