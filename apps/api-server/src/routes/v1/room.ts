import express from "express"
import { createRoom } from "../../controller/room"
export const roomRouter = express.Router()
roomRouter.post("/",createRoom)