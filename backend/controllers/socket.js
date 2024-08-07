const notificationModel = require('../models/notification');
const messageModel = require('../models/message');
const chatModel = require('../models/chat');

// This map will carry the userId to socket ID mapping. We should use a very fast database instade here.
let sockets = new Map();

const deleteSocket = (targetSocketId) => {
    for (const [userId, socketId] of sockets.entries()) {
        if (socketId === targetSocketId) {
            sockets.delete(userId)
            console.log(`Socket: ${socketId} deleted`);
            console.log(sockets);
            break;
        }
    }
}

const onSocketConnection = (socket) => {
    console.log(`Socket: ${socket.id} connected`);
    console.log(sockets);
}

const onSocketDisconnection = (socket) => {
    console.log(`Socket: ${socket.id} disconnected`);
    deleteSocket(socket.id);
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

        const receiverSocket = sockets.get(receriverId);

        if (receiverSocket) {
            socket.to(receiverSocket).emit('private-notification', type);
            callback({ status: 'OK', message: 'Notification has been successfully sent' })
        }
        else {
            // Handle the case where the receiver is offline or not connected
            console.log("Receiver is offline or not connected");
            callback({ status: 'NOK' });
        }
    } catch (error) {
        console.log(`Error while sending notification: ${error}`);
    }
}

const onSocketIdentify = (socket, userId, callback) => {
    console.log(`User ${userId} is identified with socket ID ${socket.id}`);
    sockets.set(userId, socket.id);
    callback({ status: 'OK', message: 'You successfully identified' })
    console.log(sockets);
}

const onSocketPrivateMessage = (io, payload, callback) => {

    try {
        const { senderId, body, receiverId, chatId, sentAt, newChat } = payload;

        const messageRecord = messageModel({
            body,
            senderId,
            chatId,
            sentAt
        })

        if(!newChat){
            // No need to use async/await
            Promise.all([
                messageRecord.save(),
                chatModel.findByIdAndUpdate(chatId, { lastMessage: messageRecord._id })
            ])
        }

        payload.sentAt = messageRecord.sentAt;

        const receiverSocket = sockets.get(receiverId);

        if (receiverSocket) {
            // Socket.io docs says that I must use io instade of socket here!!!
            io.timeout(1000).to(receiverSocket).emit('private-message', payload, (error, responses) => {
                if (error) {
                    console.log("Error in sending message:", error);
                }
                else {
                    if (responses.length) {
                        // Receiver is online
                        callback(responses[0])
                    }
                    else {
                        // Receiver is ofline
                        callback({ status: 'not-received' })
                    }
                }
            });
        }
        else {
            // Handle the case where the receiver is offline or not connected
            console.log("Receiver is offline or not connected");
            callback({ status: 'not-received' });
        }
    } catch (error) {
        console.log(`Error in sending message or saving it: ${error}`);

    }
}

module.exports = {
    onSocketIdentify,
    onSocketNotification,
    onSocketPrivateMessage,
    onSocketConnection,
    onSocketDisconnection
}