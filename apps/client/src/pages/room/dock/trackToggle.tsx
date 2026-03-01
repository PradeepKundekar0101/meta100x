import { TrackToggle, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useRef } from "react";


export const TrackToggleComponent = () => {
  const controlBarRef = useRef<HTMLDivElement>(null);
  const { localParticipant } = useLocalParticipant();
  const isScreenSharing = localParticipant.isScreenShareEnabled;

  return (
    <div ref={controlBarRef} className="flex items-center space-x-4">
      <TrackToggle
        className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105"
        source={Track.Source.Microphone}
      />
      <TrackToggle
        className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105"
        source={Track.Source.Camera}
      />
      <TrackToggle
        source={Track.Source.ScreenShare}
        className={`p-2 rounded-full transition-all duration-300 ease-in-out hover:scale-105 ${isScreenSharing
          ? "bg-[#6658fe] text-white hover:bg-[#5548e0]"
          : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
      >
        {/* <MonitorUp size={20} /> */}
      </TrackToggle>
    </div>
  );
};
