import { User } from "@repo/types";

export type Space = {
  id: string;
  roomCode: string;
  mapId: string;
  creatorId: string;
  isActive: boolean;
  createdAt: string;
  roomName: string;
};
export type Message = {
  id: string;
  createdAt: string;
  senderId: string;
  sender: User;
  content: string;
};
