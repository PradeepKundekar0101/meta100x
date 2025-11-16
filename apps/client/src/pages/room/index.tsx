import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/use-axios";
import { ChevronLeft, Settings } from "lucide-react";
// import { getScene } from "@/utils/getScene";
import MainScene from "@/scenes/Scene";
import ChatBox from "./chatBox";
import Dock from "./dock";
import { WebSocketSingleton } from "@/utils/websocket";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { LiveKitClient } from "@/lib/livekit";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  VideoTrack,
  TrackReference,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useDrag, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Preloader from "@/scenes/Preloader";
import MyVideoConference from "./videoConference";
const Room: React.FC = () => {
  const wsUrl = import.meta.env.VITE_LIVEKIT_WSS_URL;
  const { roomCode } = useParams();

  const { user } = useAppSelector((state) => state.auth);
  const api = useAxios();
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [livekitToken, setLivekitToken] = useState<string>();
  //   const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  // const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["room", roomCode],
    queryFn: async () => {
      return (await api.get("/room/code/" + roomCode)).data;
    },
  });

  const initWebSocket = useCallback(() => {
    if (data?.data && user) {
      localStorage.setItem("roomId", roomCode!);

      const ws = WebSocketSingleton.getInstance();
      WebSocketSingleton.setPlayers({
        userId: user.id,
        userName: user.userName,
        avatarId: user.avatarId!,
      });

      ws.onopen = () => {
        toast("Connected to room", { position: "bottom-left" });
      };

      ws.onerror = (error) => {
        console.log("WebSocket error:", error);
        toast.error("WebSocket connection failed", { position: "bottom-left" });
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, [data, user, roomCode]);

  const initPhaser = useCallback(
    async (mapId: string) => {
      try {
        const Phaser = await import("phaser");
        new Phaser.Game({
          type: Phaser.AUTO,
          title: roomCode,
          scene: [Preloader, MainScene],
          parent: "game-content",
          width: window.innerWidth,
          height: window.innerHeight,
          pixelArt: true,
          scale: { zoom: 1 },
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0, x: 0 },
              // debug: true,
            },
          },
          backgroundColor: "#000",
        });
      } catch (error) {
        console.error("Failed to initialize Phaser", error);
        toast.error("Game initialization failed");
      }
    },
    [roomCode]
  );

  // const initLiveKitRoom = useCallback(async () => {
  //   if (!livekitToken) return;

  //   try {
  //     const newRoom = new LRoom();
  //     await newRoom.connect(wsUrl, livekitToken);
  //   } catch (error) {
  //     console.error("LiveKit room connection failed", error);
  //     toast.error("Video conference connection failed");
  //   }
  // }, [livekitToken, wsUrl]);

  useEffect(() => {
    if (data?.data) {
      initWebSocket();
      initPhaser(data.data.mapId);
    }
  }, [data, initWebSocket, initPhaser]);

  useEffect(() => {
    const unsubscribe = LiveKitClient.subscribe(setLivekitToken);
    return () => {
      unsubscribe();
    };
  }, []);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const openSettings = () => {
    console.log("Open Room Settings");
  };

  if (isLoading) return <div>Loading room data...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  // if (!room || !gameInitialized) return <div>Initializing...</div>;

  return (
    <div className="flex relative h-screen ">
      <div className="flex-grow relative bg-blue-500">
        <LiveKitRoom
          audio={false}
          video={false}
          token={livekitToken}
          serverUrl={wsUrl}
          data-lk-theme="default"
          className=" absolute "
        >
          <div id="game-content" className=" w-full">
            {data?.data && (
              <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded flex items-center space-x-2">
                <h1 className="text-xl font-semibold">{data.data.roomName}</h1>
                <button
                  onClick={openSettings}
                  className="hover:bg-white/20 p-1 rounded-full"
                >
                  <Settings size={16} />
                </button>
              </div>
            )}

            <Dock />
          </div>
          <DndProvider backend={HTML5Backend}>
            <MyVideoConference />
          </DndProvider>

          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>

      {data?.data && <ChatBox isChatOpen={isChatOpen} roomId={data.data.id} />}

      <button
        onClick={toggleChat}
        className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
};

export default Room;
