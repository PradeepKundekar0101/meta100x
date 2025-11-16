import { catchAsync } from "../utils/Api";
import prismaClient from "@repo/db/client";
import { Request, Response } from "express";

export const getChatsByRoomId = catchAsync(
  async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    if (!roomId) {
      return res.status(400).json({
        status: "error",
        message: "RoomId not provided",
      });
    }
    //TODO: Get the userId from the req.user.id, check if the userId is the part of room
    const chats = await prismaClient.message.findMany({
      where: {
        roomId,
      },
      include: {
        sender: {
          select: {
            userName: true,
            avatarId: true,
            id: true,
          },
        },
      },
    });
    return res.status(200).json({
      status: "success",
      data: {
        chats,
      },
    });
  },
);
