const notificationModel = require('../models/notification');

let sockets = {};

const onSocketConnection = (socket) => {
    console.log("User Connected");
    console.log(socket.id);
}

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
        socket.to(sockets[receriverId]).emit('private-message', type);
        callback({ status: 'ok', message: 'Notification has been successfully sent' })

    } catch (error) {
        console.log(`Error while sending notification: ${error}`);
    }
}

const onSocketIdentify = (socket, userId, callback) => {
    console.log(`User ${userId} is identified with socket ID ${socket.id}`);
    sockets[userId] = socket.id;
    callback({ status: 'ok', message: 'You successfully identified' })
    console.log(sockets);
}

const onSocketJoinRooms = (socket, { chatRooms }, callback) => {
    console.log(chatRooms);
    chatRooms.forEach(room => socket.join(room));
    callback({ status: 'ok', message: 'You successfully joined the rooms' })
}

const onSocketPrivateMessage = (socket, payload, callback) => {
    socket.timeout(10000).to(sockets[payload.receiverId]).emit('private-message', payload, (err, responses) => {
        if (err) {
            // some clients did not acknowledge the event in the given delay
        } else {
            console.log(responses); // one response per client
            callback({ status: responses[0], payload: payload })
        }
    });
}

module.exports = {
    onSocketIdentify,
    onSocketNotification,
    onSocketJoinRooms,
    onSocketPrivateMessage,
    onSocketConnection
}