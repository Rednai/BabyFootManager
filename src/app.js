require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
require('./socket')(http);
const gameRoutes = require('./routes/gameRoutes');

app.use(bodyParser.json());

// Open access to index.html
app.use(express.static("public"));

// Define routes
app.use('', gameRoutes);

// Run server
const port = process.env.SERVER_PORT || 8080;
http.listen(port, () => {
  console.log('Server running and listening on localhost:' + port);
});