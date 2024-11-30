import express from "express";
import { userRouter } from "./routes/v1/user.route"; 
import { roomRouter } from "./routes/v1/room";

export const router = express.Router();

router.use("/user", userRouter);
router.use("/room",roomRouter)