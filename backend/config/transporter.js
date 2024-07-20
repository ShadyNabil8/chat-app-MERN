const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const verifyTransoporter = async () => {
    try {
        await transporter.verify();
        console.log("Server is ready to take our messages");
    } catch (error) {
        console.error("Error verifying transporter:", error);
    }
}


const sendVerificationCode = async (receiverEmail, verificationCode) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: receiverEmail,
            subject: "Verification Code",
            text: `Please verify your email by clicking the link: http://${process.env.HOST}/verify-email?code=${verificationCode}`,
        });
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email'); // Optionally throw an error to handle it upstream
    }
}

module.exports = { verifyTransoporter, sendVerificationCode }

