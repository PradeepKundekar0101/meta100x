import WebSocket from "ws"
import http from "http"
import express from "express"
import { User } from "./services/User"

const app = express()
const server = http.createServer(app)
app.get("/",(req,res)=>{
    res.send("Meta100x WS Server is running")
})
const wss = new WebSocket.Server({
    server
})
wss.on("connection",(ws:WebSocket)=>{
    const user = new User(ws)
    user.initHandler()
})
server.listen(8000,()=>{
    console.log("WS Server running at PORT ",8000)
})