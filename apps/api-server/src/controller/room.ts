import { catchAsync } from "../utils/Api";
import prismaClient from "@repo/db/client";
import {createRoom,updateRoom} from "@repo/types/zodSchema"
import { Request, Response } from "express";
import AppError from "../utils/AppError";
import { generateCode } from "../utils/codeGenerator";

export const createARoom = catchAsync(async (req: Request, res: Response) => {
    const parsedData = createRoom.safeParse(req.body);
    if (!parsedData.success) 
    {
        res.status(400).json({
            status: "success",
            message: parsedData.error.message,
        });    
        return
    }
    const { roomName, creatorId,mapId } = parsedData.data;
    const newRoom = await prismaClient.room.create({
        data: {
            roomName,
            creatorId,
            mapId,
            roomCode:generateCode()
        },
    });
    res.status(201).json({
        status: "success",
        data: newRoom,
    });
});

export const getRooms = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if(!userId){
        res.status(400).json({
            status:"error",
            message:"User id not provided"
        })
    }
    const rooms = await prismaClient.room.findMany({where:{
        creatorId: userId
    }});
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
        res.status(404).json({
            status: "success",
            message: "Room not found"
        });    
        return

    }
    res.status(200).json({
        status: "success",
        data: room,
    });
});
export const getRoomByCode = catchAsync(async (req: Request, res: Response) => {
    const { roomCode } = req.params;
    const room = await prismaClient.room.findFirst({
        where: { roomCode },include:{creator:{select:{
            userName:true,
            email:true
        }}}
    });
    if (!room) {
        res.status(404).json({
            status: "success",
            message: "Room not found"
        });    
        return

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
        res.status(404).json({
            status: "success",
            message: parsedData.error.message
        });    
        return
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


export const toggleStatus = catchAsync(async (req: Request, res: Response) => {
    const { roomId } = req.params;
    if (!roomId) {
        res.status(400).json({
            status: "error",
            message: "Id not provided"
        });    
        return

    }
    const room = await prismaClient.room.findUnique({where:{id:roomId}})
    if (!room) {
        res.status(404).json({
            status: "error",
            message: "Room not found"
        });    
        return

    }
    await prismaClient.room.update({
        where:{
            id:roomId
        },data:{
            isActive:!room?.isActive
        }
    })
    res.status(200).json({
        status: "success",
        message: "Room updated successfully",
        data: "Updated",
    });
});
