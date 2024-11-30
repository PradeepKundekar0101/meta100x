import { catchAsync } from "../utils/Api";
import prismaClient from "@repo/db/client";
import {createRoom,updateRoom} from "@repo/types/zodSchema"
import { Request, Response } from "express";
import AppError from "../utils/AppError";
import { generateCode } from "../utils/codeGenerator";

export const createARoom = catchAsync(async (req: Request, res: Response) => {
    const parsedData = createRoom.safeParse(req.body);
    if (!parsedData.success) 
        throw new AppError(400, parsedData.error.message);
    const { roomName, creatorId } = parsedData.data;
    const newRoom = await prismaClient.room.create({
        data: {
            roomName,
            creatorId,
            roomCode:generateCode()
        },
    });
    res.status(201).json({
        status: "success",
        data: newRoom,
    });
});

export const getRooms = catchAsync(async (req: Request, res: Response) => {
    const rooms = await prismaClient.room.findMany();
    res.status(200).json({
        status: "success",
        data: rooms,
    });
});

export const getRoomById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const room = await prismaClient.room.findUnique({
        where: { id },
    });
    if (!room) {
        throw new AppError(404, "Room not found");
    }
    res.status(200).json({
        status: "success",
        data: room,
    });
});

export const updateRoomA = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsedData = updateRoom.safeParse(req.body);
    if (!parsedData.success) {
        throw new AppError(400, parsedData.error.message);
    }
    const updatedRoom = await prismaClient.room.update({
        where: { id },
        data: parsedData.data,
    });
    res.status(200).json({
        status: "success",
        data: updatedRoom,
    });
});

export const deleteRoom = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedRoom = await prismaClient.room.delete({
        where: { id },
    });
    res.status(200).json({
        status: "success",
        message: "Room deleted successfully",
        data: deletedRoom,
    });
});
