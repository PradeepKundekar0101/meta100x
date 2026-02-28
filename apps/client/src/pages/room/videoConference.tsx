import { useRef, useState, useEffect, useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  useTracks,
  VideoTrack,
  TrackReference,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Move, Maximize2, MonitorUp } from "lucide-react";

function getDefaultTileSize(track: { source: Track.Source }) {
  if (track.source === Track.Source.ScreenShare) {
    return { width: 480, height: 320 };
  }
  return { width: 200, height: 150 };
}

const MyVideoConference = () => {
  const sources = useMemo(
    () => [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    []
  );
  const options = useMemo(() => ({ onlySubscribed: false }), []);

  const tracks = useTracks(sources, options);

  const [videoStates, setVideoStates] = useState(() => {
    const savedStates = localStorage.getItem("videoStates");
    return savedStates
      ? JSON.parse(savedStates)
      : tracks.map((track, index) => {
        const size = getDefaultTileSize(track);
        return {
          id: track.participant.sid,
          x: 20 * index,
          y: 20 * index,
          ...size,
        };
      });
  });

  useEffect(() => {
    localStorage.setItem("videoStates", JSON.stringify(videoStates));
  }, [videoStates]);

  useEffect(() => {
    setVideoStates(
      (currentStates: {
        map: (
          arg0: (state: { id: string }) => (string | { id: string })[]
        ) => Iterable<readonly [unknown, unknown]> | null | undefined;
      }) => {
        const existingStatesMap = new Map(
          currentStates.map((state) => [state.id, state])
        );

        const newStates = tracks.map((track) => {
          const existingState = existingStatesMap.get(track.participant.sid);
          const size = getDefaultTileSize(track);
          return (
            existingState || {
              id: track.participant.sid,
              x: 20 * tracks.indexOf(track),
              y: 20 * tracks.indexOf(track),
              ...size,
            }
          );
        });

        return newStates;
      }
    );
  }, [tracks]);

  const moveBox = (id: string, x: number, y: number) => {
    setVideoStates((prev: { id: string }[]) =>
      prev.map((state) => (state.id === id ? { ...state, x, y } : state))
    );
  };

  const resizeBox = (id: string, width: number, height: number) => {
    setVideoStates((prev: { id: string }[]) =>
      prev.map((state) =>
        state.id === id ? { ...state, width, height } : state
      )
    );
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {tracks.map((track) => {
        const state = videoStates.find(
          (state: { id: string }) => state.id === track.participant.sid
        );
        return (
          track.publication && (
            <DraggableResizableVideo
              key={track.participant.sid}
              track={track}
              x={state?.x || 0}
              y={state?.y || 0}
              width={state?.width || 200}
              height={state?.height || 150}
              onMove={moveBox}
              onResize={resizeBox}
            />
          )
        );
      })}
    </div>
  );
};

const DraggableResizableVideo = ({
  track,
  x,
  y,
  width,
  height,
  onMove,
  onResize,
}: {
  track: TrackReference;
  x: number;
  y: number;
  width: number;
  height: number;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Dragging logic
  const [{ isDragging }, drag] = useDrag({
    type: "video",
    item: () => ({
      id: track.participant.sid,
      x,
      y,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = x + delta.x;
        const newY = y + delta.y;
        onMove(track.participant.sid, newX, newY);
      }
    },
  });

  const [, resize] = useDrag({
    type: "resize",
    item: () => ({
      id: track.participant.sid,
      width,
      height,
    }),
    collect: (monitor) => ({
      isResizing: monitor.isDragging(),
    }),
    end: (_, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newWidth = Math.max(100, Math.round(width + delta.x));
        const newHeight = Math.max(100, Math.round(height + delta.y));
        onResize(track.participant.sid, newWidth, newHeight);
      }
    },
  });

  // Enable dragging and dropping
  const [, drop] = useDrop({
    accept: "video",
  });

  const isScreenShare = track.source === Track.Source.ScreenShare;

  drag(drop(ref));
  resize(resizeRef);
  return (
    <div
      ref={ref}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        position: "absolute",
        width,
        height,
        opacity: isDragging ? 0.5 : 1,
        transition: "opacity 0.2s ease",
      }}
      className={`bg-gray-800 rounded-lg overflow-hidden relative group pointer-events-auto ${isScreenShare
          ? "ring-2 ring-[#6658fe]/40"
          : track.participant.isSpeaking
            ? "border-green-300 shadow-green-600 shadow-xl border-2"
            : "border-none"
        }`}
    >
      {/* Drag Handle */}
      <div
        className="absolute top-1 left-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 rounded-full p-1 cursor-move"
        title="Drag to move"
      >
        <Move size={16} className="text-white" />
      </div>

      {/* Screen share badge */}
      {isScreenShare && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-[#6658fe]/80 backdrop-blur-sm px-2 py-0.5 rounded-md">
          <MonitorUp size={11} className="text-white" />
          <span className="text-white text-[10px] font-semibold">Screen</span>
        </div>
      )}

      {/* Identity Label */}
      <h1 className="absolute bg-white text-black bottom-3 left-2 z-10">
        {track.participant.name}{" "}
        {track.publication?.isSubscribed ? "(Sub)" : "(Unsub)"}
      </h1>

      {/* Video Track */}
      <VideoTrack
        trackRef={track}
        className={`w-full h-full ${isScreenShare ? "object-contain bg-black" : "object-cover"}`}
      />

      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className="absolute bottom-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 rounded-full p-1 cursor-se-resize"
        title="Drag to resize"
      >
        <Maximize2 size={16} className="text-white" />
      </div>
    </div>
  );
};

export default MyVideoConference;
