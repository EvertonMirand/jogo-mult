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
  const playerId = socket.id;
  console.log(`Player connect on server with id ${playerId}`);
  game.addPlayer({ playerId });
  socket.emit('setup', game.state);

  socket.on('disconnect', () => {
    game.removePlayer({ playerId });
  });
});

server.listen(3000, () => {
  console.log('> Serve listening on port: 3000');
});
