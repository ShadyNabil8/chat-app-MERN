const notificationModel = require('../models/notification');

let users = {};

const onSocketNotification = async (socket, { senderId, receriverId, notification, type }, callback) => {
    try {
        const notificationRecord = notificationModel({
            receiver: receriverId,
            type: type,
            content: {
                title: '',
                message: ''
            },
            requester: senderId
        })

        await notificationRecord.save();

        console.log(notificationRecord);
        socket.to(users[receriverId]).emit('private-message', type);
        callback({ status: 'ok', message: 'Notification has been successfully sent' })

    } catch (error) {
        console.log(`Error while sending notification: ${error}`);
    }
}

const onSocketIdentify = (socket, userId, callback) => {
    console.log(`User ${userId} is identified with socket ID ${socket.id}`);
    users[userId] = socket.id;
    callback({ status: 'ok', message: 'You successfully identified' })
}

const onSocketJoinRooms = (socket, { chatRooms }, callback) => {
    console.log(chatRooms);
    chatRooms.forEach(room => socket.join(room));
    callback({ status: 'ok', message: 'You successfully joined the rooms' })
}

const onSocketPrivateMessage = (socket, { chatId, message }, callback) => {
    console.log('private-message: ' + message);
    console.log('chatId: ' + chatId);

    socket.to(chatId).emit('private-message', message);

    callback({ status: 'ok', message: 'Messagse sent successfully' })
}

module.exports = { onSocketIdentify, onSocketNotification, onSocketJoinRooms, onSocketPrivateMessage }