import { useState } from "react";
// import { WebSocketSingleton } from "@/utils/websocket";
import { ExitRoomDialog } from "./exitRoomDialog";
import { RoomParticipantsDialog } from "./roomParticipantsDialog";
import { RoomDetailsDialog } from "./roomDetailsDialog";
import { TrackToggleComponent } from "./trackToggle";
import { StatusUpdate } from "./statusUpdate";

interface DockType {}

const Dock: React.FC<DockType> = () => {
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  // const [socket, setSocket] = useState<WebSocket | null>(null);
  // useEffect(() => {
  //   const socket = WebSocketSingleton.getInstance();
  //   setSocket(socket);
  // }, []);
  return (
    <div className="absolute bottom-2 z-50 media left-1/2 transform -translate-x-1/2 bg-[#0008] backdrop-blur-2xl p-2 px-10 flex justify-center rounded-full space-x-4">
      <TrackToggleComponent />
      <StatusUpdate />
      <RoomParticipantsDialog />
      <RoomDetailsDialog />
      <ExitRoomDialog
        isExitDialogOpen={isExitDialogOpen}
        setIsExitDialogOpen={setIsExitDialogOpen}
      />
    </div>
  );
};

export default Dock;
