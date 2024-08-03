const asynchandler = require('express-async-handler')
const userModel = require('../models/User')

const list = asynchandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(403).json({
            success: false,
            error: {
                cause: 'Authorization Error',
                message: 'User is npt authorized'
            }
        })
    }

    const { friends } = await userModel.findById(user).select('friends').populate('friends', 'displayedName profilePicture email');
    
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

module.exports = { list }