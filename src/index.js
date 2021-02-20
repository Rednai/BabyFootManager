require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
require('./socket')(http);
const game = require('./game');

app.use(bodyParser.json());

// Open access to index.html
app.use(express.static("public"));

// Routes
app.get('/games', game.getGames);
app.post('/games', game.createGame);
app.put('/games/:game_id', game.finishGame);
app.delete('/games/:game_id', game.deleteGame);

// Run server
const port = process.env.SERVER_PORT || 8080;
http.listen(port, () => {
  console.log('Server running and listening on localhost:' + port);
});