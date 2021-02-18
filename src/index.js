require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('./socket')(http);
const db = require('./queries');

app.use(bodyParser.json());

// Open access to index.html
app.use(express.static("public"));

// Routes
app.get('/games', db.getGames);
app.post('/games', db.createGame);
app.put('/games/:game_id', db.finishGame);
app.delete('/games/:game_id', db.deleteGame);

// Run server
const port = process.env.SERVER_PORT || 8080;
http.listen(port, () => {
  console.log('Server running and listening on localhost:' + port);
});