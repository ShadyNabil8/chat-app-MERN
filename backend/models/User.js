const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: String,
    email: String,
    passwordHash: String,
    isActive: Boolean,
    profilePicture: String,
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt: Date,
})

module.exports = mongoose.model(User, schema);