import { WebSocketServer } from 'ws';
import { User } from './services/User';
import { createServer } from 'http';
import dotenv from "dotenv"
dotenv.config()
const server = createServer();

const wss = new WebSocketServer({ 
  server
});

wss.on('connection', function connection(ws, req) {
  try {
    console.log('New connection added from:', req.socket.remoteAddress);
    let user = new User(ws);
    user.initHandler();
  } catch (error) {
    console.error("Failed to initialize user:", error);
    if (ws.readyState === ws.OPEN) {
      ws.close(1002, 'Failed to initialize user');
    }
  }
});

wss.on("error", (err:any) => {
  console.error("WebSocket server error:", err);
  
  if (err.code === 'WS_ERR_UNEXPECTED_RSV_1') {
    console.error('Received WebSocket frame with unexpected RSV1 bit set');
  }
});


server.listen(8000, () => {
  console.log('WebSocket server is running on port 8001');
});


server.on('error', (err) => {
  console.error('HTTP server error:', err);
});


server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  } else {
    res.writeHead(404);
    res.end();
  }
});