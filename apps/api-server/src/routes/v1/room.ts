import express from "express"
import {
    createARoom,
    getRooms,
    getRoomById,
    updateRoomA,
    deleteRoom,
} from "../../controller/room";
export const roomRouter = express.Router()

roomRouter.post("/", createARoom);
roomRouter.get("/", getRooms);
roomRouter.get("/:id", getRoomById);
roomRouter.patch("/:id", updateRoomA);
roomRouter.delete("/:id", deleteRoom);
