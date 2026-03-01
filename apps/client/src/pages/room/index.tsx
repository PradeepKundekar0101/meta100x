import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/use-axios";
import axios from "axios";
import { Plus, Minus } from "lucide-react";
import Phaser from "phaser";
import MainScene from "@/scenes/Scene";
import Dock, { type ViewMode } from "./dock";
import SpaceSidebar, { type TabId } from "./spaceSidebar";
import { WebSocketSingleton } from "@/utils/websocket";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { LiveKitClient } from "@/lib/livekit";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProximitySubscriptionManager from "./../../scenes/ProximitySubscriptionManager";
import Preloader from "@/scenes/Preloader";
import MyVideoConference from "./videoConference";
import MeetingView from "./meetingView";
import MeetingSubscriptionManager from "./meetingSubscriptionManager";

const Room: React.FC = () => {
  const wsUrl = import.meta.env.VITE_LIVEKIT_WSS_URL;
  const { roomCode } = useParams();
  const { user, token } = useAppSelector((state) => state.auth);
  const api = useAxios();
  const isGuest = !user || !token;

  const guestId = useMemo(
    () =>
      localStorage.getItem("guestId") ||
      `guest-${crypto.randomUUID().slice(0, 8)}`,
    []
  );

  const effectiveUser = useMemo(
    () =>
      user ?? {
        id: guestId,
        userName: localStorage.getItem("guestName") || "Guest",
        avatarId: localStorage.getItem("avatarId") || "pajji",
      },
    [user, guestId]
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<TabId>("chat");
  const [livekitToken, setLivekitToken] = useState<string>();
  const [viewMode, setViewMode] = useState<ViewMode>("space");
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const syncHandler = (e: Event) => {
      const fitZoom = (e as CustomEvent).detail.zoom as number;
      setZoom(fitZoom);
      setMinZoom(fitZoom);
    };
    window.addEventListener("ph-zoom-sync", syncHandler);
    return () => window.removeEventListener("ph-zoom-sync", syncHandler);
  }, []);

  const handleZoom = (newZoom: number) => {
    const clamped = Math.max(newZoom, minZoom);
    setZoom(clamped);
    window.dispatchEvent(
      new CustomEvent("ph-zoom", { detail: { zoom: clamped } })
    );
  };

  const openSidebarTo = (tab: TabId) => {
    if (sidebarOpen && sidebarTab === tab) {
      setSidebarOpen(false);
    } else {
      setSidebarTab(tab);
      setSidebarOpen(true);
    }
  };

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["room", roomCode],
    queryFn: async () => {
      if (isGuest) {
        return (
          await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/room/code/${roomCode}`
          )
        ).data;
      }
      return (await api.get("/room/code/" + roomCode)).data;
    },
  });

  const initWebSocket = useCallback(() => {
    if (data?.data && effectiveUser) {
      localStorage.setItem("roomId", roomCode!);
      if (data.data.mapId) {
        localStorage.setItem("mapId", data.data.mapId);
      }

      const ws = WebSocketSingleton.getInstance();
      WebSocketSingleton.setPlayers({
        userId: effectiveUser.id,
        userName: effectiveUser.userName,
        avatarId: effectiveUser.avatarId!,
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
  }, [data, effectiveUser, roomCode]);

  const initPhaser = useCallback(() => {
    if (gameRef.current) return;
    const container = document.getElementById("game-content");
    const w = container?.clientWidth ?? window.innerWidth;
    const h = container?.clientHeight ?? window.innerHeight;
    try {
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        title: roomCode,
        scene: [Preloader, MainScene],
        parent: "game-content",
        width: w,
        height: h,
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0, x: 0 },
          },
        },
        backgroundColor: "#0c0c14",
      });
      gameRef.current = game;
    } catch (error) {
      console.error("Failed to initialize Phaser", error);
      toast.error("Game initialization failed");
    }
  }, [roomCode]);

  useEffect(() => {
    if (data?.data) {
      initWebSocket();
      initPhaser();
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [data, initWebSocket, initPhaser]);

  useEffect(() => {
    const unsubscribe = LiveKitClient.subscribe(setLivekitToken);
    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) return <div>Loading room data...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-screen bg-[#0c0c14]">
      {data?.data && (
        <SpaceSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          roomId={data.data.id}
          roomName={data.data.roomName}
          roomCode={roomCode || ""}
          activeTab={sidebarTab}
          onTabChange={openSidebarTo}
        />
      )}

      <div className="flex-1 relative overflow-hidden">
        <div
          id="game-content"
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: viewMode === "space" ? 1 : 0,
            pointerEvents: viewMode === "space" ? "auto" : "none",
          }}
        />

        {data?.data && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#0c0c14]/80 backdrop-blur-md px-3 py-2 rounded-xl ring-1 ring-white/[0.08]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-sm font-medium">
                {data.data.roomName}
              </span>
              {viewMode === "meeting" && (
                <span className="text-[10px] text-[#a49bff] bg-[#6658fe]/15 px-2 py-0.5 rounded-full font-medium">
                  Meeting
                </span>
              )}
            </div>
          </div>
        )}

        {viewMode === "space" && (
          <div className="absolute bottom-20 left-4 z-20 flex flex-col items-center gap-1 bg-[#0c0c14]/80 backdrop-blur-md rounded-xl ring-1 ring-white/[0.08] p-1.5">
            <button
              onClick={() => handleZoom(Math.min(zoom + 0.15, minZoom + 2))}
              className="p-1.5 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
            >
              <Plus size={14} />
            </button>
            <div className="relative h-24 w-6 flex items-center justify-center">
              <div className="absolute h-full w-0.5 bg-white/[0.08] rounded-full" />
              <input
                type="range"
                min={minZoom}
                max={minZoom + 2}
                step="0.1"
                value={zoom}
                onChange={(e) => handleZoom(parseFloat(e.target.value))}
                className="absolute w-24 h-1.5 appearance-none bg-transparent rotate-[-90deg] cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6658fe]
                  [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(102,88,254,0.4)]
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-track]:bg-transparent"
              />
            </div>
            <button
              onClick={() => handleZoom(Math.max(zoom - 0.15, minZoom))}
              className="p-1.5 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-[10px] text-white/25 font-mono tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        )}

        <LiveKitRoom
          audio={false}
          video={false}
          token={livekitToken}
          connectOptions={{
            autoSubscribe: false,
          }}
          serverUrl={wsUrl}
          data-lk-theme="default"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {viewMode === "space" ? (
            <>
              <ProximitySubscriptionManager />
              <DndProvider backend={HTML5Backend}>
                <MyVideoConference />
              </DndProvider>
            </>
          ) : (
            <>
              <MeetingSubscriptionManager />
              <div className="pointer-events-auto">
                <MeetingView />
              </div>
            </>
          )}
          <RoomAudioRenderer />
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto">
            <Dock viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </LiveKitRoom>
      </div>
    </div>
  );
};

export default Room;
