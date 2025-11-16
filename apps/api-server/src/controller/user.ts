import { catchAsync } from "../utils/Api";
import prismaClient from "@repo/db/client";
import { Request, Response } from "express";
import { updateUserSchema } from "@repo/types/zodSchema";
import AppError from "../utils/AppError";

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany();
  res.status(200).json({
    status: "success",
    data: users,
  });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prismaClient.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedData = updateUserSchema.safeParse(req.body);
  if (!parsedData.success) throw new AppError(400, parsedData.error.message);
  const updatedUser = await prismaClient.user.update({
    where: { id },
    data: parsedData.data,
  });
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedUser = await prismaClient.user.delete({
    where: { id },
  });
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
    data: deletedUser,
  });
});

export const updateAvatar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const avatarId = req.body.avatarId;
  if (!avatarId) throw new AppError(400, "Provide Avatar");
  const updatedUser = await prismaClient.user.update({
    where: { id },
    data: { avatarId },
  });
  res.status(200).json({
    status: "success",
    message: "Avatar updated successfully",
    data: updatedUser,
  });
});
