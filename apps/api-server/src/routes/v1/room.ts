import express from "express";
import {
  createARoom,
  getRooms,
  getRoomById,
  updateRoomA,
  deleteRoom,
  toggleStatus,
  getRoomByCode,
} from "../../controller/room";
export const roomRouter = express.Router();

roomRouter.post("/", createARoom);
roomRouter.get("/user/:userId", getRooms);
roomRouter.get("/:id", getRoomById);
roomRouter.get("/code/:roomCode", getRoomByCode);
roomRouter.patch("/:id", updateRoomA);
roomRouter.delete("/:id", deleteRoom);
roomRouter.put("/toggleActive/:roomId", toggleStatus);
