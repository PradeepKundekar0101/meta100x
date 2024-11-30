import WebSocket from "ws"
import {EventTypes,UserEvents} from "@repo/types"
import { RoomManager } from "./RoomManager";
import crypto from "crypto"
export class User{
    public id:string = ""
    private roomId:string=""
    public playerX:number | undefined = undefined;
    public playerY:number | undefined = undefined;

    constructor(private ws:WebSocket){
        this.id = crypto.randomUUID()
    }
    public sendMessage = (message:string)=>{
        this.ws.send(message)
    }
    initHandler = ()=>{

        this.ws.on("message",(data)=>{
            try {
                const {type,payload}:{type:UserEvents,payload:any} = JSON.parse(data.toString())
                switch(type){
                    case "JOIN_SPACE":
                        const {roomId} = payload;
                        if(!roomId){
                            //TODO Send invalid roomid
                            this.ws.close()
                        }
                        this.roomId = roomId
                        this.playerX = 390,
                        this.playerY = 1260,
                        RoomManager.getInstance().addUser(this,roomId)
                        RoomManager.getInstance().broadcastMessage(this,JSON.stringify({
                           type:EventTypes.Server.USER_JOINED,
                           payload:{
                            id:this.id,
                            x:this.playerX,
                            y:this.playerY
    
                           } 
                        }),roomId)
                        this.sendMessage(JSON.stringify({
                            type: EventTypes.Server.SPACE_JOINED,
                            payload:{userId:this.id,users:Array.from(RoomManager.getInstance().rooms?.get(roomId)||[]).filter((e)=>e.id!=this.id).map((e)=>{return {id:e.id,x:e.playerX,y:e.playerY}})}
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
                        }),this.roomId)
                        break;
                
                    }
            } catch (error) {
                this.sendMessage(JSON.stringify({type:"error",payload:{message:"Invalid data"}}))

            }
        })
        this.ws.on("error", (error) => {
            console.error(`WebSocket error for user ${this.id}:`, error);
            if (this.roomId) {
                RoomManager.getInstance().removeUser(this, this.roomId);
            }
        });
        
        this.ws.on("close", () => {
            console.log(`WebSocket closed for user ${this.id}`);
            if (this.roomId) {
                RoomManager.getInstance().removeUser(this, this.roomId);
                RoomManager.getInstance().broadcastMessage(this, JSON.stringify({
                    type: EventTypes.Server.USER_LEFT,
                    payload: {
                        id: this.id
                    }
                }), this.roomId);
            }
        });
    }
}