import express from "express";
import { getChatsByRoomId } from "../../controller/chat";
export const chatRouter = express.Router();
chatRouter.get("/:roomId", getChatsByRoomId);
