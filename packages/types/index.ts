export const EventTypes = {
  User: {
    JOIN_SPACE: "JOIN_SPACE",
    LEAVE_SPACE: "LEAVE_SPACE",
    MOVE: "MOVE",
    CHAT_MESSAGE_CLIENT: "CHAT_MESSAGE_CLIENT",
    UPDATE_STATUS: "UPDATE_STATUS",
  },
  Server: {
    SPACE_JOINED: "SPACE_JOINED",
    USER_JOINED: "USER_JOINED",
    USER_LEFT: "USER_LEFT",
    MOVEMENT: "MOVEMENT",
    CHAT_MESSAGE_SERVER: "CHAT_MESSAGE_SERVER",
    UPDATE_STATUS_SERVER: "UPDATE_STATUS_SERVER",
  },
} as const;

export type UserEvents = (typeof EventTypes.User)[keyof typeof EventTypes.User];
export type ServerEvents =
  (typeof EventTypes.Server)[keyof typeof EventTypes.Server];

export type User = {
  id: string;
  userName: string;
  email: string;
  avatarId: string | undefined;
  createdAt: string;
};
export type Space = {
  id: string;
  roomCode: string;
  mapId: string;
  creatorId: string;
  isActive: boolean;
  createdAt: string;
  roomName: string;
};
