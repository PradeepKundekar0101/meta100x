import { useState } from "react";
import { LayoutGrid, Map } from "lucide-react";
import { ExitRoomDialog } from "./exitRoomDialog";
import { TrackToggleComponent } from "./trackToggle";

export type ViewMode = "space" | "meeting";

const Dock = ({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) => {
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const isMeeting = viewMode === "meeting";

  return (
    <div className="absolute bottom-3 z-50 left-1/2 transform -translate-x-1/2 bg-[#0c0c14]/80 backdrop-blur-xl p-2 px-6 flex justify-center items-center rounded-2xl ring-1 ring-white/[0.08] gap-3">
      <TrackToggleComponent />
      <div className="w-px h-6 bg-white/[0.08]" />
      <button
        onClick={() => onViewModeChange(isMeeting ? "space" : "meeting")}
        title={isMeeting ? "Switch to Space view" : "Switch to Meeting view"}
        className={`p-2 rounded-full transition-all duration-300 ease-in-out hover:scale-105 ${
          isMeeting
            ? "bg-[#6658fe] text-white hover:bg-[#5548e0]"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
      >
        {isMeeting ? <Map size={20} /> : <LayoutGrid size={20} />}
      </button>
      <div className="w-px h-6 bg-white/[0.08]" />
      <ExitRoomDialog
        isExitDialogOpen={isExitDialogOpen}
        setIsExitDialogOpen={setIsExitDialogOpen}
      />
    </div>
  );
};

export default Dock;
