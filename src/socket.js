let io;

/*
 * Initiate socket.io module
 */
module.exports = (http) => {
    const socketIo = require('socket.io')(http);
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