import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import avatarData from "@/mock/avatars.json";
import { login } from "@/store/slices/authSlice";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Loader2,
  Hash,
  Users,
  Search,
} from "lucide-react";
import { Label } from "@/components/ui/label";

const JoinRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAxios();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const [roomCode, setRoomCode] = useState<string | undefined>(
    searchParams.get("roomCode") || ""
  );
  const [roomDetails, setRoomDetails] = useState<{
    mapId: string;
    roomName: string;
    creator: { userName: string; email: string };
  } | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    user?.avatarId
  );
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const prevAvatarId = user?.avatarId;

  const fetchRoomDetails = async () => {
    if (!roomCode?.trim()) {
      toast.error("Please enter a valid room code");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/room/code/${roomCode}`);
      setRoomDetails(data.data);
      console.log(data.data);
      toast.success("Room details loaded!");
    } catch (error) {
      toast.error("Failed to fetch room details");
      console.log(error);
      setRoomDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const updateAvatarMutation = useMutation({
    mutationKey: ["updateAvatar"],
    mutationFn: async () => {
      return (
        await api.patch(`/user/${user?.id}/avatar`, {
          avatarId: selectedAvatar,
        })
      ).data;
    },
    onSuccess: () => {
      dispatch(
        login({
          user: { ...user!, avatarId: selectedAvatar || "defaultAvatar" },
          token,
        })
      );
      localStorage.setItem("avatarId", selectedAvatar || "");
    },
  });

  const handleJoinRoom = () => {
    if (!roomCode?.trim() || !roomDetails) {
      toast.error("Invalid room or room details missing");
      return;
    }
    if (selectedAvatar !== prevAvatarId) {
      updateAvatarMutation.mutate();
    }
    localStorage.setItem("roomId", roomCode);
    localStorage.setItem("mapId", roomDetails.mapId);
    navigate(`/space/${roomCode}`);
  };

  useEffect(() => {
    if (searchParams.get("roomCode")) {
      fetchRoomDetails();
    }
  }, [searchParams]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Join a{" "}
          <span className="text-primaryBlue italic font-medium">Space</span>
        </h1>
        <p className="text-lg text-gray-500">
          Enter a room code and jump into the action!
        </p>
      </div>

      <Card className="max-w-4xl w-full border-none bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-8">
          <div className="mb-8">
            <Label className="text-base font-semibold text-gray-800 mb-2 block">
              Room Code
            </Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="roomCode"
                  placeholder="Enter code here..."
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="pl-10 h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && fetchRoomDetails()}
                />
              </div>
              <Button
                onClick={fetchRoomDetails}
                className="h-12 px-6 bg-primaryBlue hover:bg-primaryBlue/90"
                disabled={loading || !roomCode}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {roomDetails && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Users className="h-6 w-6 text-primaryBlue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {roomDetails.roomName}
                    </h2>
                    <div className="mt-1 flex flex-col gap-1 text-sm text-gray-600">
                      <p>
                        Hosted by{" "}
                        <span className="font-medium text-gray-900">
                          {roomDetails.creator.userName}
                        </span>
                      </p>
                      <p className="text-gray-400 text-xs">
                        {roomDetails.creator.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primaryBlue" />
              <Label className="text-base font-semibold text-gray-800">
                Choose Your Character
              </Label>
            </div>

            <div className="relative group/carousel">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-md rounded-full transition-all hover:scale-110"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </Button>

              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-8 pt-4 px-4 snap-x scrollbar-hide no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {avatarData.map((avatar) => (
                  <div
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`
                      relative transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer rounded-2xl overflow-hidden border-2 flex-shrink-0
                      ${
                        selectedAvatar === avatar.id
                          ? "w-[200px] sm:w-[240px] grayscale-0 border-primaryBlue shadow-2xl scale-105 z-10"
                          : "w-[60px] sm:w-[80px] grayscale hover:grayscale-0 hover:w-[100px] border-transparent opacity-60 hover:opacity-100"
                      }
                      h-[320px]
                      snap-center
                    `}
                  >
                    <div className="absolute inset-0 bg-gray-900">
                      <img
                        src={"/" + avatar.thumbnail}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${
                          selectedAvatar === avatar.id
                            ? "opacity-80"
                            : "opacity-40"
                        }`}
                      />
                    </div>

                    <div
                      className={`
                      absolute bottom-0 left-0 right-0 p-4 transition-all duration-300
                      ${
                        selectedAvatar === avatar.id
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }
                    `}
                    >
                      <span className="text-white font-bold text-xl block tracking-wide uppercase">
                        {avatar.name}
                      </span>
                      {selectedAvatar === avatar.id && (
                        <div className="mt-2 flex items-center gap-2 text-primaryBlue font-medium text-sm animate-in fade-in slide-in-from-bottom-2">
                          <Check className="w-4 h-4" /> Selected
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-md rounded-full transition-all hover:scale-110"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleJoinRoom}
            className="w-full h-14 text-lg font-bold bg-primaryBlue hover:bg-primaryBlue/90 shadow-lg shadow-primaryBlue/20 transition-all duration-300 hover:scale-[1.01]"
            size="lg"
            disabled={!roomDetails || !selectedAvatar}
          >
            {loading ? "Waiting for room..." : "Join Room"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default JoinRoom;
