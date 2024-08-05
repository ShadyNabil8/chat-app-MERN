const notificationModel = require('../models/notification');
const messageModel = require('../models/message');
const chatModel = require('../models/chat');

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

    const { senderId, message, receiverId, chatId } = payload;
    console.log(chatId);

    const messageRecord = messageModel({
        body: message,
        sender: senderId,
        chat: chatId,
    })

    Promise.all([
        messageRecord.save(),
        chatModel.findByIdAndUpdate(chatId, { lastMessage: messageRecord._id })

    ])

    payload.lastMessageDate = messageRecord.sentAt;

    socket.timeout(100).to(sockets[receiverId]).emit('private-message', payload, (err, responses) => {
        if (err) {
            console.log('hi');
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