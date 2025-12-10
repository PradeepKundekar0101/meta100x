import { RoomManager } from "./RoomManager";

export const handleMessages = (message: string) => {
  console.log("Handling message:", JSON.parse(message.toString()));
  const { type, payload, userId, roomCode } = JSON.parse(message.toString());
  RoomManager.getInstance().broadcastMessage(
    userId,
    JSON.stringify({
      type,
      payload,
    }),
    roomCode
  );
};
