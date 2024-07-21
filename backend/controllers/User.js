const userModel = require('../models/User');
const verificationCodeModel = require('../models/verificationCode');
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator');
const { hashPassword, comparePassword } = require('../utils/password')
const { sendVerificationCode } = require('../config/transporter')
const crypto = require('crypto');

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
            // console.log(errors);
            return res.status(400).json({
                success: false,
                error: {
                    cause: 'input-fields',
                    data: errors.array()
                }
            });
        }
        const hashedPassword = await hashPassword(req.body.password)

        const userRecord = new userModel({
            displayedName: req.body.displayedName,
            email: req.body.email,
            passwordHash: hashedPassword,
            profilePicture: `${process.env.AVATAR_API}/${Date.now()}-${req.body.displayedName}.png`,

        });

        await userRecord.save();

        const verificationCode = crypto.randomBytes(20).toString('hex')
        const verificationExpires = Date.now() + 3600000  // 1 Hour

        const verificationRecord = new verificationCodeModel({
            userId: userRecord._id,
            code: verificationCode,
            expiresAt: verificationExpires
        });

        // console.log(verificationRecord);

        await verificationRecord.save();

        await sendVerificationCode(req.body.email, verificationCode)

        // console.log(userRecord);

        res.status(201).json({
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

    res.status(200).json({
        success: true,
        data: 'Email verified successfully!'
    });
})

const login = asyncHandler(async (req, res) => {

    const { email, password } = req.query;

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

        // Convert expiresAt to a Date object
        const expiresAtDate = new Date(verificationCodeRecord.expiresAt);

        if (!verificationCodeRecord || (Date.now() > expiresAtDate.getTime())) {

            const verificationCode = crypto.randomBytes(20).toString('hex');
            const verificationExpires = Date.now() + 3600000; // 1 Hour

            const verificationRecord = new verificationCodeModel({
                userId: userRecord._id,
                code: verificationCode,
                expiresAt: verificationExpires
            });

            await verificationRecord.save();

            await sendVerificationCode(email, verificationCode)

            return res.status(403).json({
                success: false,
                error: {
                    cause: 'verification',
                    data: 'We have resent a verification code. Please check your email to verify your account.'
                }
            })
        }

        if (verificationCodeRecord) {
            await verificationCodeModel.deleteOne({ _id: verificationCodeRecord._id });
        }

        return res.status(403).json({
            success: false,
            error: {
                cause: 'verification',
                data: 'Please check your email to verify your account first.'
            }
        })
    }
    // console.log(userRecord);
    return res.status(200).json({
        success: true,
        data: userRecord
    })

})

module.exports = { register, verifyEmail, login }