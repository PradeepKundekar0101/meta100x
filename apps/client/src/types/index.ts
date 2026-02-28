
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

export interface User {
  id: string;
  x: number;
  y: number;
  userName: string;
  avatarId: string;
}

export interface SpaceJoinedPayload {
  userId: string;
  liveKitAccessToken: string;
  users: User[];
}

export interface UserJoinedPayload {
  id: string;
  x: number;
  y: number;
  userName: string;
  avatarId: string;
}

export interface MovementPayload {
  userId: string;
  x: number;
  y: number;
  xPos: number;
  yPos: number;
}

export interface UserLeftPayload {
  id: string;
  userName: string;
}