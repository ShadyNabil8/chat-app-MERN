const asynchandler = require('express-async-handler')
const userModel = require('../models/User');
const chatModel = require('../models/chat');
const { default: mongoose } = require('mongoose');

const list = asynchandler(async (req, res) => {
    const { friends } = await userModel.findById(req.user).select('friends').populate('friends', 'displayedName profilePicture email');

    if (!friends) {
        return res.status(404).json({
            success: false,
            error: {
                cause: 'Not found',
                data: 'Friends not found'
            }
        })
    }

    return res.status(200).json({
        success: true,
        data: friends
    });
})

const unfriend = asynchandler(async (req, res) => {
    
    const { friendId } = req.body;

    if (!friendId) {
        return res.status(400).json({
            success: false,
            error: {
                cause: 'Invalid request',
                data: 'FriendId not provided'
            }
        });
    }

    const [userRecord, friendRecord] = await Promise.all([
        userModel.findById(req.user),
        userModel.findById(friendId),
    ])

    if (!userRecord || !friendRecord) {
        return res.status(404).json({
            success: false,
            error: {
                cause: 'User or friend not found',
                data: 'The user or friend record could not be found'
            }
        });
    }

    userRecord.friends = userRecord.friends.filter(friend => !friend.equals(new mongoose.Types.ObjectId(friendId)));
    friendRecord.friends = friendRecord.friends.filter(friend => !friend.equals(new mongoose.Types.ObjectId(req.user)));

    await Promise.all([
        await userRecord.save(),
        await friendRecord.save(),
        await chatModel.findOneAndDelete({
            participants: {
                $all: [req.user, friendId]
            }
        })    
    ])

    return res.status(200).json({
        success: true,
        message: 'Friend removed successfully'
    });
})

module.exports = { list, unfriend }