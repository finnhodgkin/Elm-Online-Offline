const websocket = require('ws');

const ws = new websocket.Server({ port: 5000 });

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
