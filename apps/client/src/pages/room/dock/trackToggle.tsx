import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useRef } from "react";

export const TrackToggleComponent = () => {
  const controlBarRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={controlBarRef} className="flex items-center space-x-4">
      <TrackToggle
        className={`p-2 rounded-full
         bg-gray-700 text-white hover:bg-gray-600
     transition-all duration-300 ease-in-out hover:scale-105`}
        source={Track.Source.Microphone}
      />
      <TrackToggle
        className={`p-2 rounded-full ${"bg-gray-700 text-white hover:bg-gray-600"} transition-all duration-300 ease-in-out hover:scale-105`}
        source={Track.Source.Camera}
      />
      {/* <TrackToggle source={Track.Source.ScreenShare} /> */}
    </div>
  );
};
