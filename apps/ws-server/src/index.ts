import { WebSocketServer } from 'ws';
import { User } from './services/User';
import { createServer } from 'http';
import dotenv from "dotenv";
import {RabbitMQLib} from "@repo/rabbitmq/rabbit"
import { RedisClient } from './lib/Redis';
import { handleMessages } from './services/handleIncoming';
dotenv.config();

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    try {
        console.log('New connection added from:', req.socket.remoteAddress);
        const user = new User(ws); 
        user.initHandler();
        // RedisClient.getPublisher().on("message",(channel:string,message:string)=>{
        //     if(channel==="MESSAGE"){
        //         handleMessages(user,message)
        //     }
        // })
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


server.on('request', (req, res) => {
    if (req.url === '/health') {
        res.writeHead(200);
        res.end('OK');
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.on('error', (err) => {
    console.error('HTTP server error:', err);
});


process.on('SIGINT', async () => {
    console.log("Closing server...");
    if ( RabbitMQLib.channel) await RabbitMQLib.channel.close();
    if (RabbitMQLib.connection) await RabbitMQLib.connection.close();
    if(RedisClient.getPublisher()){
        RedisClient.getPublisher().quit((err)=>{
            if(!err){
                console.log("Redis publisher connection closed")
            }
        })
    }
    if(RedisClient.getSubscriber()){
        RedisClient.getSubscriber().quit((err)=>{
            if(!err){
                console.log("RedisSubscriber connection closed")
            }
        })
    }
    server.close(() => {
        console.log("HTTP and WebSocket servers closed.");
        process.exit(0);
    });
});


server.listen(8000, async () => {
    console.log('WebSocket server is running on port 8000');
    await RabbitMQLib.connectQueue(); 
    RedisClient.getSubscriber().subscribe("MESSAGE")
    RedisClient.getSubscriber().on(
        "message",
        (channel: string, message: string) => {
            if (channel === "MESSAGE") {
              console.log(message)
            handleMessages(message);
          }
        }
      );
   
});
