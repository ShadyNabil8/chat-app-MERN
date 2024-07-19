const userSchema = require('../models/User');
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator');

const create = [
    body('displayedName').isAlphanumeric().isLength({ min: 3, max: 30 }),
    body('password').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
    body('email').isEmail(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body);
        res.json({
            success: true,

        })
    })
]

module.exports = { create }