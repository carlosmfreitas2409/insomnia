import { IncomingMessage, Server } from 'http';
import { Socket } from 'net';
import { WebSocket, WebSocketServer } from 'ws';

/**
 * Starts an echo WebSocket server that receives messages from a client and echoes them back.
 */
export function startWebSocketServer(server: Server) {
  const wsServer = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    upgrade(wsServer, request, socket, head);
  });

  wsServer.on('connection', handleConnection);
}

const handleConnection = (ws: WebSocket, req: IncomingMessage) => {
  console.log('WebSocket connection was opened');
  console.log('Upgrade headers:', req.headers);

  ws.on('message', (message, isBinary) => {
    if (isBinary) {
      ws.send(message);
      return;
    }
    if (message.toString() === 'close') {
      ws.close(1003, 'Invalid message type');
    }
    ws.send(message.toString());
  });

  ws.on('close', () => {
    console.log('WebSocket connection was closed');
  });
};
const redirectOnSuccess = (socket: Socket) => {
  socket.end(`HTTP/1.1 302 Found
Location: ws://localhost:4010

`);
  return;
};
const return401withBody = (socket: Socket) => {
  socket.end(`HTTP/1.1 401 Unauthorized

  <!doctype html>
  <html>
  <body>
  <div>
    <h1>401 Unauthorized</h1>
  </div>
  </body>
  </html>`);
  return;
};
const upgrade = (wss: WebSocketServer, request: IncomingMessage, socket: Socket, head: Buffer) => {
  if (request.url === '/redirect') {
    return redirectOnSuccess(socket);
  }
  if (request.url === '/bearer') {
    if (request.headers.authorization !== 'Bearer insomnia-cool-token-!!!1112113243111') {
      return401withBody(socket);
      return;
    }
    return redirectOnSuccess(socket);
  }
  if (request.url === '/basic-auth') {
    // login with user:password
    if (request.headers.authorization !== 'Basic dXNlcjpwYXNzd29yZA==') {
      return401withBody(socket);
      return;
    }
    return redirectOnSuccess(socket);
  }
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
};
