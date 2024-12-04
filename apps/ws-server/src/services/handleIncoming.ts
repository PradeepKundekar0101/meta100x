
import { RoomManager } from "./RoomManager";

export const handleMessages = ( message: string) => {
  const { type, payload,userId,roomCode } = JSON.parse(message.toString());
  console.log(type)
  console.log(payload)
  console.log(userId)
  console.log(roomCode)
  RoomManager.getInstance().broadcastMessage(
    userId,
    JSON.stringify({
      type,
      payload,
    }),
    roomCode
  );
};
