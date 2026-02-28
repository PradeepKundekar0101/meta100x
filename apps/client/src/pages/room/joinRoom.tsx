import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import avatarData from "@/mock/avatars.json";
import { login } from "@/store/slices/authSlice";
import {
  Check,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      toast.success("Room found!");
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

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        {/* Back link */}
        <button
          onClick={() => navigate("/myrooms")}
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-10 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to spaces
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Join a space
          </h1>
          <p className="text-sm text-white/35 mt-1.5 leading-relaxed">
            Enter a room code to find and join an existing space.
          </p>
        </div>

        <div className="space-y-8">
          {/* Room code input */}
          <div className="space-y-2.5">
            <label className="text-[13px] font-medium text-white/50 block">
              Room code
            </label>
            <div className="flex gap-2">
              <Input
                name="roomCode"
                placeholder="Enter room code..."
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchRoomDetails()}
                className="h-12 text-[15px] px-4 bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-primaryBlue/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-primaryBlue/20 transition-all duration-200 rounded-xl font-mono tracking-wide"
              />
              <Button
                onClick={fetchRoomDetails}
                disabled={loading || !roomCode}
                className="h-12 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-white/60 hover:text-white transition-all duration-200"
                variant="ghost"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Room details */}
          {roomDetails && (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[15px] font-medium text-white truncate">
                      {roomDetails.roomName}
                    </h3>
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  </div>
                  <p className="text-xs text-white/35 mt-0.5">
                    Hosted by{" "}
                    <span className="text-white/55">
                      {roomDetails.creator.userName}
                    </span>
                    <span className="text-white/20 mx-1.5">&middot;</span>
                    <span className="text-white/25">
                      {roomDetails.creator.email}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Avatar selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-white/50">
                Choose avatar
              </label>
              <span className="text-[11px] text-white/25">
                {avatarData.length} characters
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {avatarData.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={cn(
                    "group relative rounded-xl overflow-hidden aspect-square outline-none ring-1 transition-all duration-200",
                    selectedAvatar === avatar.id
                      ? "ring-primaryBlue/60 shadow-lg shadow-primaryBlue/10 scale-[1.03] z-10"
                      : "ring-white/[0.07] hover:ring-white/[0.15] opacity-70 hover:opacity-100"
                  )}
                >
                  <img
                    src={"/" + avatar.thumbnail}
                    alt={avatar.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div
                    className={cn(
                      "absolute inset-0 transition-colors duration-200",
                      selectedAvatar === avatar.id
                        ? "bg-primaryBlue/10"
                        : "bg-black/30 group-hover:bg-black/15"
                    )}
                  />

                  {/* Selected check */}
                  <div
                    className={cn(
                      "absolute top-2 right-2 transition-all duration-150",
                      selectedAvatar === avatar.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75"
                    )}
                  >
                    <div className="bg-primaryBlue text-white p-1 rounded-full shadow-md">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </div>
                  </div>

                  {/* Name label */}
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="text-[11px] font-medium text-white/80 block text-center">
                      {avatar.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Join button */}
          <Button
            onClick={handleJoinRoom}
            className="w-full h-12 text-sm font-medium rounded-xl bg-primaryBlue hover:bg-primaryBlue/90 text-white shadow-lg shadow-primaryBlue/20 hover:shadow-primaryBlue/30 transition-all duration-200 hover:-translate-y-px group disabled:opacity-40"
            disabled={!roomDetails || !selectedAvatar}
          >
            Join Space
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
