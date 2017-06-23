const websocket = require('ws');
const hapi = require('hapi');
const server = new hapi.Server();

server.register(require('inert'), function() {});

server.connection({ port: process.env.PORT || 3000 });

server.route({
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    reply.file('index.html');
  },
});

server.start(() => {
  console.log('started');
});

const ws = new websocket.Server({ port: process.env.PORT || 3000 });

ws.broadcast = data => {
  console.log('bc');

  ws.clients.forEach(client => {
    if (client.readyState === websocket.OPEN) {
      client.send(data);
    }
  });
};

ws.on('connection', socket => {
  console.log(socket);
  ws.clients.forEach(client => {
    if (client !== socket && client.readyState === websocket.OPEN) {
      client.send('Client connection opened');
    }
  });

  socket.on('message', data => {
    console.log('data>>', data);
    ws.clients.forEach(client => {
      if (client !== socket && client.readyState === websocket.OPEN) {
        client.send(data);
      }
    });
  });

  socket.on('close', () => {
    ws.clients.forEach(client => {
      client.send('Client connection closed');
    });
  });
});
