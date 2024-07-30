const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    displayedName: String,
    email: String,
    passwordHash: String,
    profilePicture: String,
    isActive: {
        type: Boolean,
        default: false
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    isVerified: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('user', schema);
