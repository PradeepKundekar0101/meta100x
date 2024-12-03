import WebSocket from "ws"
import {EventTypes,UserEvents,User as TUser} from "@repo/types"
import { RoomManager } from "./RoomManager";
import {JwtPayload, verify} from "jsonwebtoken"
import crypto from "crypto"
import prismaClient from "@repo/db/client"
import {RabbitMQLib} from "@repo/rabbitmq/rabbit"
const JWT_SECRET=process.env.JWT_SECRET || "pradeep"
export class User{
    public id:string = ""
    private roomCode:string=""
    private roomId:string=""
    public playerX:number | undefined 
    public playerY:number | undefined
    public user:Partial<TUser> | undefined 
    constructor(private ws:WebSocket){
        this.id = crypto.randomUUID()
    }
    public sendMessage = (message:string)=>{
        this.ws.send(message)
    }
    initHandler = ()=>{
        this.ws.on("message",async (data)=>{
            try {
                const {type,payload}:{type:UserEvents,payload:any} = JSON.parse(data.toString())
                switch(type){
                    case "JOIN_SPACE":
                        const {roomId,token} = payload;

                        if(!roomId || !token){
                            this.sendMessage(JSON.stringify({
                                type:"error",
                                message:"No room id or token"
                            }))
                            this.ws.close()
                        }
                        const tokenVerify = verify(token, JWT_SECRET) as JwtPayload
                        if(!tokenVerify){
                            this.sendMessage(JSON.stringify({
                                type:"error",
                                message:"Invalid token"
                            }))
                            this.ws.close()
                        }
                        const userId = tokenVerify.userId
                        const userFromDb = await prismaClient.user.findUnique({where:{id:userId!}})
                        if(!userFromDb ){
                            this.sendMessage(JSON.stringify({
                                type:"error",
                                message:"User not found"
                            }))
                            this.ws.close()
                            return
                        }
                        const roomFromDb = await prismaClient.room.findFirst({
                            where:{roomCode:roomId}
                        })
                        if(!roomFromDb ){
                            this.sendMessage(JSON.stringify({
                                type:"error",
                                message:"Room not found"
                            }))
                            this.ws.close()
                            return
                        }
                        this.roomId = roomFromDb.id
                        const {userName,id,avatarId} = userFromDb
                        this.user = {userName,id,avatarId:avatarId!}
                        this.roomCode = roomId
                        this.playerX = 390,
                        this.playerY = 1260,
                        RoomManager.getInstance().addUser(this,roomId)
                        RoomManager.getInstance().broadcastMessage(this,JSON.stringify({
                           type:EventTypes.Server.USER_JOINED,
                           payload:{
                            id:this.id,
                            userName:this.user.userName!,
                            avatarId:this.user.avatarId!,
                            x:this.playerX,
                            y:this.playerY
    
                           } 
                        }),roomId)
                        this.sendMessage(JSON.stringify({
                            type: EventTypes.Server.SPACE_JOINED,
                            payload:{userId:this.id,users:Array.from(RoomManager.getInstance().rooms?.get(roomId)||[]).filter((e)=>e.id!=this.id).map((e)=>{return {id:e.id,x:e.playerX,y:e.playerY,userName:e.user?.userName!,avatarId:e.user?.avatarId!}})}
                        }))
                        break;
                    
                    case "MOVE":
                        const {xPos,velocityX,velocityY,yPos} = payload
                        if (typeof xPos !== 'number' || typeof yPos !== 'number') {
                            this.sendMessage(JSON.stringify({
                                type: "error",
                                payload: { message: "Invalid move coordinates" }
                            }));
                            return;
                        }

                        this.playerX = xPos
                        this.playerY! = yPos;
                        console.log("Updated",this.playerX,this.playerY)
                        RoomManager.getInstance().broadcastMessage(this,JSON.stringify({
                            type:EventTypes.Server.MOVEMENT,
                            payload:{
                                userId:this.id,
                                x:velocityX,
                                y:velocityY,
                                xPos:this.playerX,
                                yPos:this.playerY
                            }
                        }),this.roomCode)
                        break;
                    case "CHAT_MESSAGE_CLIENT":
                        const {token:senderToken,content,userName:senderName,avatarId:senderAvatar} = payload
                        const tokenVerified = verify(senderToken, JWT_SECRET) as JwtPayload
                        if(!tokenVerified){
                            this.sendMessage(JSON.stringify({
                                type:"ERROR",
                                message:"Invalid token"
                            }))
                            this.ws.close()
                        }
                        const createdAt = new Date()
                        const senderId = tokenVerified.userId;
                        const payloadToSend:any = {
                            senderId,
                            content,
                            userName:senderName,
                            avatarId:senderAvatar,
                            createdAt,
                            userId:senderId,
                            roomId:this.roomId
                        }
                        this.sendMessage(JSON.stringify({
                            type: EventTypes.Server.CHAT_MESSAGE_SERVER,
                            payload:payloadToSend
                        }))
                        RoomManager.getInstance().broadcastMessage(this,JSON.stringify({
                            type: EventTypes.Server.CHAT_MESSAGE_SERVER,
                            payload:payloadToSend
                        }),this.roomCode)
                        RabbitMQLib.enqueue(JSON.stringify(payloadToSend))
                    }
            } catch (error) {
                this.sendMessage(JSON.stringify({type:"error",payload:{message:"Invalid data"}}))

            }
        })
        this.ws.on("error", (error) => {
            console.error(`WebSocket error for user ${this.id}:`, error);
            if (this.roomCode) {
                RoomManager.getInstance().removeUser(this, this.roomCode);
            }
        });
        
        this.ws.on("close", () => {
            console.log(`WebSocket closed for user ${this.id}`);
            if (this.roomCode) {
                RoomManager.getInstance().removeUser(this, this.roomCode);
                RoomManager.getInstance().broadcastMessage(this, JSON.stringify({
                    type: EventTypes.Server.USER_LEFT,
                    payload: {
                        id: this.id,
                        userName:this.user?.userName
                    }
                }), this.roomCode);
            }
        });
    }
}

export const tokenVerify = (token:string)=>{
    
}