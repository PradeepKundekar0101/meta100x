import React, { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  useTracks,
  VideoTrack,
  TrackReference,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Move, Minimize2, Maximize2 } from "lucide-react";

const MyVideoConference = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  // Persist positions and sizes
  const [videoStates, setVideoStates] = useState(() => {
    const savedStates = localStorage.getItem("videoStates");
    return savedStates
      ? JSON.parse(savedStates)
      : tracks.map((track, index) => ({
          id: track.participant.sid,
          x: 20 * index,
          y: 20 * index,
          width: 200,
          height: 150,
        }));
  });

  // Update localStorage whenever video states change
  useEffect(() => {
    localStorage.setItem("videoStates", JSON.stringify(videoStates));
  }, [videoStates]);

  // Update states if tracks change
  useEffect(() => {
    setVideoStates(
      (currentStates: {
        map: (
          arg0: (state: any) => any[],
        ) => Iterable<readonly [unknown, unknown]> | null | undefined;
      }) => {
        const existingStatesMap = new Map(
          currentStates.map((state) => [state.id, state]),
        );

        const newStates = tracks.map((track) => {
          const existingState = existingStatesMap.get(track.participant.sid);
          return (
            existingState || {
              id: track.participant.sid,
              x: 20 * tracks.indexOf(track),
              y: 20 * tracks.indexOf(track),
              width: 200,
              height: 150,
            }
          );
        });

        return newStates;
      },
    );
  }, [tracks]);

  const moveBox = (id: string, x: number, y: number) => {
    setVideoStates((prev: any[]) =>
      prev.map((state) => (state.id === id ? { ...state, x, y } : state)),
    );
  };

  const resizeBox = (id: string, width: number, height: number) => {
    setVideoStates((prev: any[]) =>
      prev.map((state) =>
        state.id === id ? { ...state, width, height } : state,
      ),
    );
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {tracks.map((track) => {
        const state = videoStates.find(
          (state: { id: string }) => state.id === track.participant.sid,
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
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = x + delta.x;
        const newY = y + delta.y;
        onMove(track.participant.sid, newX, newY);
      }
    },
  });

  // Resizing logic
  const [{ isResizing }, resize] = useDrag({
    type: "resize",
    item: () => ({
      id: track.participant.sid,
      width,
      height,
    }),
    collect: (monitor) => ({
      isResizing: monitor.isDragging(),
    }),
    end: (item, monitor) => {
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
      className={`bg-gray-800 rounded-lg overflow-hidden relative group ${
        track.participant.isSpeaking
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

      {/* Identity Label */}
      <h1 className="absolute bg-white text-black bottom-3 left-2 z-10">
        {track.participant.identity}
      </h1>

      {/* Video Track */}
      <VideoTrack trackRef={track} className="w-full h-full object-cover" />

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
