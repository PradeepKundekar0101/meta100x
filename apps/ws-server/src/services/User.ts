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
                        this.playerX = 40,
                        this.playerY = 50,
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
                            payload:Array.from(RoomManager.getInstance().rooms?.get(roomId)||[]).filter((e)=>e!=this).map((e)=>{return {id:e.id,x:e.playerX,y:e.playerY}})
                        }))
                        break;
                    
                    case "MOVE":
                        const {x,y} = payload
                        if (typeof x !== 'number' || typeof y !== 'number') {
                            this.sendMessage(JSON.stringify({
                                type: "error",
                                payload: { message: "Invalid move coordinates" }
                            }));
                            return;
                        }
                        this.playerX = x;
                        this.playerY = y;
                        RoomManager.getInstance().broadcastMessage(this,JSON.stringify({
                            type:EventTypes.Server.MOVEMENT,
                            payload:{
                                userId:this.id,
                                x,
                                y
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