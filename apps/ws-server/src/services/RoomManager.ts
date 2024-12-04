import WebSocket from "ws"
import { User } from "./User";
export class RoomManager{
    private static instance: RoomManager;
    rooms: Map<string, Set<User>>;

    private constructor() {
        this.rooms = new Map();
    }

    public static getInstance(): RoomManager {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }
    public addUser = (user:User,roomId:string)=>{
        if(!this.rooms?.has(roomId)){
            this.rooms?.set(roomId,new Set())
        }
        this.rooms?.get(roomId)?.add(user)
    }
    public removeUser = (user:User,roomId:string)=>{
        if(!this.rooms?.has(roomId) || !this.rooms.get(roomId)?.has(user)){
            return;
        }
        this.rooms.get(roomId)?.delete(user)
        if(this.rooms.get(roomId)?.size==0)
            this.rooms.delete(roomId)
    }
    public broadcastMessage = (senderId:string,message:string,roomId:string)=>{
        if(!this.rooms?.has(roomId)){
            return;
        }
        this.rooms.get(roomId)?.forEach((user)=>{
            if(user.id!=senderId){
                try {
                    user.sendMessage(message);
                } catch (error) {
                    this.removeUser(user,roomId)                   
                }
            }
        })
    }
}