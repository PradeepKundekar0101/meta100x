import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/use-axios";
import { ChevronLeft } from "lucide-react";
import { getScene } from "@/utils/getScene";
import ChatBox from "./chatBox";
import Dock from "./dock";
import { WebSocketSingleton } from "@/utils/websocket";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

const Room = () => {
  const { roomCode } = useParams();
  const { user, token } = useAppSelector((state) => state.auth);
  const api = useAxios();
  const [isChatOpen, setIsChatOpen] = useState(true);
  
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["room"],
    queryFn: async () => {
      return (await api.get("/room/code/" + roomCode)).data;
    },
  });

  useEffect(() => {

    if (data && data.data && user) {

      localStorage.setItem("roomId", roomCode!);
      initPhaser(data.data.mapId);

      const ws = WebSocketSingleton.getInstance();
      WebSocketSingleton.setPlayers({userId:user.id,userName:user.userName,avatarId:user.avatarId!})
      ws.onopen = () => {
        toast("Connected to room", { position: "bottom-left" });
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error("WebSocket connection failed", { position: "bottom-left" });
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, [data, user]);

  async function initPhaser(mapId: string) {
    const Phaser = await import("phaser");
    new Phaser.Game({
      type: Phaser.AUTO,
      title: roomCode,
      scene: getScene(mapId),
      parent: "game-content",
      width: window.innerWidth,
      height: window.innerHeight,
      pixelArt: true,
      scale: {
        zoom: 1,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0, x: 0 },
          // debug: true,
        },
      },
      backgroundColor: "#000",
    });
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Loading room data...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <h1 className="text-2xl font-bold">
          {
            //@ts-ignore
            error.response?.data?.message || error.message
          }
        </h1>
      </div>
    );
  }

  return (
    <div className="flex relative h-screen overflow-hidden">
      <div className="flex-grow relative bg-black">
        <div id="game-content" className="w-full h-full" />
        {data && data.data && (
          <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded">
            <h1 className="text-xl font-semibold">{data.data.roomName}</h1>
          </div>
        )}

        <Dock />
      </div>

      {data && data.data && (
        <ChatBox 
          isChatOpen={isChatOpen} 
          roomId={data.data.id} 
        />
      )}

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