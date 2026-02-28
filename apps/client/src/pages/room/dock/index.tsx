import { useState } from "react";
import { ExitRoomDialog } from "./exitRoomDialog";
import { TrackToggleComponent } from "./trackToggle";

const Dock = () => {
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  return (
    <div className="absolute bottom-3 z-50 media left-1/2 transform -translate-x-1/2 bg-[#0c0c14]/80 backdrop-blur-xl p-2 px-6 flex justify-center items-center rounded-2xl ring-1 ring-white/[0.08] gap-3">
      <TrackToggleComponent />
      <div className="w-px h-6 bg-white/[0.08]" />
      <ExitRoomDialog
        isExitDialogOpen={isExitDialogOpen}
        setIsExitDialogOpen={setIsExitDialogOpen}
      />
    </div>
  );
};

export default Dock;
