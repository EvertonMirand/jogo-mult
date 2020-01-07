import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import createGame from './public/game.js';

const app = express();
const server = http.createServer(app);

const sockets = socketio(server);

app.use(express.static('public'));

const game = createGame();

sockets.on('connection', socket => {
  const player = socket.id;
  console.log(`Player connect on server with id ${player}`);
  socket.emit('setup', game.state);
});

server.listen(3000, () => {
  console.log('> Serve listening on port: 3000');
});
