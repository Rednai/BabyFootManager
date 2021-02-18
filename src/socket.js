let io;

/*
 * Initiate socket.io module
 */
module.exports = function(http) {
    const socketIo = require('socket.io')(http);

    socketIo.on('connection', (socket) => {
        console.log('New user connected');
    });

    io = socketIo;
    return io;
};

/*
 * Export socket.io module (the module need to be initialized first /!\)
 */
module.exports.getIo = () => {
    if (!io) {
        throw new Error("Io is uninitialized");
    }
    return io;
}