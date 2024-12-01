export const EventTypes = {
    User: {
        JOIN_SPACE: "JOIN_SPACE",
        LEAVE_SPACE: "LEAVE_SPACE",
        MOVE: "MOVE",
    },
    Server: {
        SPACE_JOINED: "SPACE_JOINED",
        USER_JOINED: "USER_JOINED",
        USER_LEFT:"USER_LEFT",
        MOVEMENT: "MOVEMENT",
    },
} as const;

export type UserEvents = typeof EventTypes.User[keyof typeof EventTypes.User];
export type ServerEvents = typeof EventTypes.Server[keyof typeof EventTypes.Server];

export type User ={
    id: string;
    userName:string,
    email:string,
    avatarId:string | undefined,
    createdAt:string
}
export type Space = {
    id:string,
    roomCode:string,
    mapId:string,
    creatorId:string,
    isActive:boolean,
    createdAt:string,
    roomName:string
}
