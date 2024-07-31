let users = {};

const onSocketNotification = (socket, { senderId, receriverId, notification }, callback) => {
    socket.to(users[receriverId]).emit('private-message', notification);
    callback({ status: 'ok', message: 'Notification has been successfully sent' })
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