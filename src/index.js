require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('./queries');

app.use(bodyParser.json());

app.use(express.static("public"));
app.get('/games', db.getGames);
app.post('/games', db.createGame);
app.put('/games/:id', db.finishGame);
app.delete('/games/:id', db.deleteGame);

io.on('connection', (socket) => {
  console.log('New user connected');
});

const port = process.env.SERVER_PORT || 8080;
http.listen(port, () => {
  console.log('listening on localhost:' + port);
});