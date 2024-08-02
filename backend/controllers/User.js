const userModel = require('../models/User');
const verificationCodeModel = require('../models/verificationCode');
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator');
const { hashPassword, comparePassword } = require('../utils/password')
const { sendVerificationCode } = require('../config/transporter')
const crypto = require('crypto');
const { generateToken } = require('../utils/auth')

require('dotenv').config();

const register = [
    body('displayedName')
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
            return res.status(400).json({
                success: false,
                error: {
                    cause: 'input-fields',
                    data: errors.array()
                }
            });
        }

        const { displayedName, email, password } = req.body;

        const existedEmail = await userModel.findOne({ email: email });

        if (existedEmail) {
            return res.status(403).json({
                success: false,
                error: {
                    cause: 'input-fields',
                    data: [{
                        "type": "field",
                        "value": "",
                        "msg": "Email is already registered.",
                        "path": "email",
                        "location": "body"
                    }]
                }
            });
        }

        const hashedPassword = await hashPassword(password)

        const userRecord = new userModel({
            displayedName: displayedName,
            email: email,
            passwordHash: hashedPassword,
            profilePicture: `${process.env.AVATAR_API}/${Date.now()}-${displayedName}.png`,

        });

        await userRecord.save();

        const verificationCode = crypto.randomBytes(20).toString('hex')
        const verificationExpires = Date.now() + 3600000  // 1 Hour

        const verificationRecord = new verificationCodeModel({
            userId: userRecord._id,
            code: verificationCode,
            expiresAt: verificationExpires
        });


        await verificationRecord.save();

        await sendVerificationCode(email, verificationCode)


        return res.status(201).json({
            success: true,
            data: 'Registration successful. Please check your email to verify your account.'
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
        return res.status(400).json({
            success: false,
            error: {
                cause: 'verification',
                data: 'Verification code is invalid or has expired.'
            }
        });

    }

    const userRecord = await userModel.findById(verificationCodeRecord.userId);

    if (!userRecord) {
        return res.status(400).json({
            success: false,
            error: {
                cause: 'verification',
                data: 'User not found.'
            }
        })
    }

    userRecord.isVerified = true;

    await userRecord.save()

    await verificationCodeModel.deleteOne({ _id: verificationCodeRecord._id });

    return res.status(200).json({
        success: true,
        data: 'Email verified successfully!'
    });
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userRecord = await userModel.findOne({ email: email });

    if (!userRecord) {
        return res.status(401).json({
            success: false,
            error: {
                cause: 'input-fields',
                data: [{
                    path: "email",
                    msg: 'The email address you entered isn\'t connected to an account'
                }]
            }
        })
    }

    const isCorrectPassword = await comparePassword(password, userRecord.passwordHash)

    if (!isCorrectPassword) {
        return res.status(400).json({
            success: false,
            error: {
                cause: 'input-fields',
                data: [{
                    path: "password",
                    msg: 'Email or password is not correct'
                }]
            }
        })
    }

    if (!userRecord.isVerified) {

        const verificationCodeRecord = await verificationCodeModel.findOne({
            userId: userRecord._id
        })


        if (!verificationCodeRecord || (Date.now() > new Date(verificationCodeRecord.expiresAt).getTime())) {

            if (verificationCodeRecord) {
                await verificationCodeModel.deleteOne({ _id: verificationCodeRecord._id });
            }

            const verificationCode = crypto.randomBytes(20).toString('hex');
            const verificationExpires = Date.now() + 3600000; // 1 Hour

            const newVerificationCodeRecord = new verificationCodeModel({
                userId: userRecord._id,
                code: verificationCode,
                expiresAt: verificationExpires
            });

            await newVerificationCodeRecord.save();

            await sendVerificationCode(email, verificationCode)

            return res.status(403).json({
                success: false,
                error: {
                    cause: 'verification',
                    data: 'We have resent a verification code. Please check your email to verify your account.'
                }
            })
        }

        return res.status(403).json({
            success: false,
            error: {
                cause: 'verification',
                data: 'Please check your email to verify your account first.'
            }
        })
    }

    const token = generateToken(userRecord);

    const { displayedName, profilePicture, friends } = userRecord;

    return res.status(200).json({
        success: true,
        data: {
            email,
            displayedName,
            profilePicture,
            friends,
            userId: userRecord._id
        },
        token,
    })

})


const profile = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: {
                cause: 'authorization',
                data: 'Not authorized, token failed'
            }
        })
    }

    const userId = req.user;

    const userRecord = await userModel.findById(userId)

    const { displayedName, profilePicture, friends, email } = userRecord;

    return res.status(200).json({
        success: true,
        data: {
            email,
            displayedName,
            profilePicture,
            friends,
            userId,
        },
    })
})

const search = asyncHandler(async (req, res) => {
    const { query, userId } = req.query;
    const users = await userModel
        .find({
            displayedName: { $regex: `^${query}`, $options: 'i' },
            _id: { $ne: userId }
        })
        .select('_id displayedName profilePicture email')

    res.json(users)
});

module.exports = { register, verifyEmail, login, profile, search }