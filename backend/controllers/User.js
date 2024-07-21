const userModel = require('../models/User');
const verificationCodeModel = require('../models/verificationCode');
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator');
const { hashPassword, comparePassword } = require('../utils/password')
const { sendVerificationCode } = require('../config/transporter')
const crypto = require('crypto');

require('dotenv').config();;

const create = [
    body('displayedName')
        .isAlphanumeric()
        .isLength({ min: 3, max: 30 })
        .withMessage('Displayed name must be alphanumeric and between 3 to 30 characters long.'),
    body('password')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .withMessage('Password must be at least 8 characters long, include at least one letter, one number, and one special character.'),
    body('email')
        .isEmail()
        .withMessage('Email must be valid.'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({ errors: errors.array() });
        }
        const hashedPassword = await hashPassword(req.body.password)

        const userRecord = new userModel({
            displayedName: req.body.displayedName,
            email: req.body.email,
            passwordHash: hashedPassword,
            profilePicture: `${process.env.AVATAR_API}/${Date.now()}-${req.body.displayedName}.png`,

        });

        // await userRecord.save();

        const verificationCode = crypto.randomBytes(20).toString('hex')
        const verificationExpires = Date.now() + 3600000  // 1 Hour

        const verificationRecord = new verificationCodeModel({
            userId: userRecord._id,
            code: verificationCode,
            expiresAt: verificationExpires
        });

        // await verificationRecord.save();

        // await sendVerificationCode(req.body.email, verificationCode)

        // console.log(userRecord);

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email to verify your account.'
        });
    })
]

const verifyEmail = asyncHandler(async (req, res) => {

    const { code } = req.query;

    const verificationCodeRecord = await verificationCodeModel.findOne({
        code: code,
        expiresAt: { $gt: Date.now() }
    });

    if (!verificationCodeRecord) {
        return res.status(400).json({ error: 'Verification code is invalid or has expired.' });

    }

    const userRecord = await userModel.findById(verificationCodeRecord.userId);

    if (!userRecord) {
        return res.status(400).json({ error: 'User not found.' })
    }

    userRecord.isActive = true;

    await userRecord.save()

    await verificationCodeRecord.deleteOne({ _id: verificationCodeRecord._id });

    res.status(200).json({ success: true, message: 'Email verified successfully!' });
})



module.exports = { create, verifyEmail }