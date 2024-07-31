const onSocketDisconnect = (socket) => {
    console.log('User disconnected');
}
const onSocketMessage = (msg) => {
    console.log('message: ' + msg);
}

module.exports = { onSocketMessage, onSocketDisconnect }