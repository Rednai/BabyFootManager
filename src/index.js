const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static("public"));

io.on('connection', (socket) => {
  console.log('New user connected');
});

http.listen(8080, () => {
  console.log('listening on *:8080');
});