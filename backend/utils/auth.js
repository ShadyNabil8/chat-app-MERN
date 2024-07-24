require('dotenv').config()
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    if (!user) {
        throw new Error('Error in generation token')
    }
    const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY, {
        expiresIn: '1h',
    });

    return token
}

const protect = asyncHandler(async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {

        res.status(401).json({
            success: false,
            error: {
                cause: 'authorization',
                data: 'Not authorized, no token'
            }
        })
    }

    const token = req.headers.authorization.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = decoded.id;
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            error: {
                cause: error.name || 'authorization',
                data: error.message || 'Not authorized, token failed'
            }
        })
    }
})

module.exports = { generateToken, protect }