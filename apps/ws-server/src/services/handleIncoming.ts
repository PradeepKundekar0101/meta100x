
import { RoomManager } from "./RoomManager";

export const handleMessages = ( message: string) => {
  const { type, payload,userId,roomId } = JSON.parse(message.toString());
  console.log(type)
  console.log(payload)
  console.log(userId)
  console.log(roomId)
  RoomManager.getInstance().broadcastMessage(
    userId,
    JSON.stringify({
      type,
      payload,
    }),
    roomId
  );
};
