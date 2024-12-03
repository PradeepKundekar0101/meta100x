import express from "express";
import userRouter  from "./routes/v1/user"; 
import authRouter  from "./routes/v1/auth"; 
import { roomRouter } from "./routes/v1/room";
import { chatRouter } from "./routes/v1/chat";

export const router = express.Router();

router.use("/auth",authRouter)
router.use("/user", userRouter);
router.use("/room",roomRouter)
router.use("/chats",chatRouter)