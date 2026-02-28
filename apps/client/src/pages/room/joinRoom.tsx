import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import axios from "axios";
import avatarData from "@/mock/avatars.json";
import { login } from "@/store/slices/authSlice";
import {
  Check,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Search,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RoomDetails = {
  mapId: string;
  roomName: string;
  creator: { userName: string; email: string };
};

const JoinRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAxios();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const isGuest = !user || !token;

  const [step, setStep] = useState<1 | 2>(1);
  const [roomCode, setRoomCode] = useState(
    searchParams.get("code") || searchParams.get("roomCode") || ""
  );
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    user?.avatarId
  );
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevAvatarId = user?.avatarId;

  const fetchRoomDetails = async () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a valid room code");
      return;
    }
    setLoading(true);
    try {
      let responseData;
      if (isGuest) {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/room/code/${roomCode}`
        );
        responseData = res.data;
      } else {
        const res = await api.get(`/room/code/${roomCode}`);
        responseData = res.data;
      }
      setRoomDetails(responseData.data);
      toast.success("Room found!");
      setStep(2);
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
    if (!roomCode.trim() || !roomDetails) {
      toast.error("Invalid room or room details missing");
      return;
    }

    if (isGuest) {
      if (!guestName.trim()) {
        toast.error("Please enter your display name");
        return;
      }
      const guestId = `guest-${crypto.randomUUID().slice(0, 8)}`;
      localStorage.setItem("guestId", guestId);
      localStorage.setItem("guestName", guestName.trim());
      localStorage.setItem("avatarId", selectedAvatar || "pajji");
      localStorage.setItem("roomId", roomCode);
      localStorage.setItem("mapId", roomDetails.mapId);
      navigate(`/space/${roomCode}`);
      return;
    }

    if (selectedAvatar !== prevAvatarId) {
      updateAvatarMutation.mutate();
    }
    localStorage.setItem("roomId", roomCode);
    localStorage.setItem("mapId", roomDetails.mapId);
    navigate(`/space/${roomCode}`);
  };

  const canJoin = isGuest
    ? !!roomDetails && !!selectedAvatar && !!guestName.trim()
    : !!roomDetails && !!selectedAvatar;

  useEffect(() => {
    const code = searchParams.get("code") || searchParams.get("roomCode");
    if (code) {
      fetchRoomDetails();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        {/* Back link */}
        <button
          onClick={() =>
            step === 2 ? setStep(1) : navigate(isGuest ? "/" : "/spaces")
          }
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-10 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          {step === 2 ? "Change room code" : isGuest ? "Back to home" : "Back to spaces"}
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                  step >= s
                    ? "bg-primaryBlue text-white shadow-[0_0_12px_rgba(102,88,254,0.4)]"
                    : "bg-white/[0.06] text-white/25 ring-1 ring-white/[0.08]"
                )}
              >
                {step > s ? (
                  <Check className="w-3 h-3" strokeWidth={3} />
                ) : (
                  s
                )}
              </div>
              <span
                className={cn(
                  "text-[13px] font-medium transition-colors duration-300",
                  step >= s ? "text-white/70" : "text-white/20"
                )}
              >
                {s === 1
                  ? "Find space"
                  : isGuest
                    ? "Your details"
                    : "Pick avatar"}
              </span>
              {s === 1 && (
                <div
                  className={cn(
                    "w-10 h-px transition-colors duration-300",
                    step >= 2 ? "bg-primaryBlue/50" : "bg-white/[0.08]"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Sliding container */}
        <div ref={containerRef} className="relative overflow-hidden w-full">
          <div
            className="flex w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(${step === 1 ? "0%" : "-50%"})` }}
          >
            {/* ─── Step 1: Room Code ─── */}
            <div className="w-1/2 shrink-0 pr-8">
              <div className="max-w-md">
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold text-white tracking-tight">
                    Join a space
                  </h1>
                  <p className="text-sm text-white/35 mt-1.5 leading-relaxed">
                    Enter a room code to find and join an existing space.
                  </p>
                </div>

                <div className="space-y-5">
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
                        onKeyDown={(e) =>
                          e.key === "Enter" && fetchRoomDetails()
                        }
                        className="h-12 text-[15px] px-4 bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-primaryBlue/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-primaryBlue/20 transition-all duration-200 rounded-xl font-mono tracking-wide"
                      />
                      <Button
                        onClick={fetchRoomDetails}
                        disabled={loading || !roomCode}
                        className="h-12 px-5 rounded-xl bg-primaryBlue hover:bg-primaryBlue/90 text-white shadow-lg shadow-primaryBlue/20 transition-all duration-200 disabled:opacity-40"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Step 2: Avatar Selection ─── */}
            <div className="w-1/2 shrink-0 pl-8">
              <div className="max-w-lg">
                {/* Room details card */}
                {roomDetails && (
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primaryBlue/20 to-primaryBlue/5 flex items-center justify-center ring-1 ring-white/[0.06] shrink-0">
                        <span className="text-sm font-bold text-white/70">
                          {roomDetails.roomName
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
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
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guest name input */}
                {isGuest && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                      What should we call you?
                    </h2>
                    <p className="text-sm text-white/35 mt-1 leading-relaxed">
                      Enter a display name to identify yourself in the space.
                    </p>
                    <div className="mt-4">
                      <div className="relative">
                        <UserRound
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                        />
                        <Input
                          name="guestName"
                          placeholder="Your display name..."
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          maxLength={24}
                          className="h-12 text-[15px] pl-11 pr-4 bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-primaryBlue/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-primaryBlue/20 transition-all duration-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="h-px bg-white/[0.06] mt-6" />
                  </div>
                )}

                {/* Heading */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white tracking-tight">
                    Choose your avatar
                  </h2>
                  <p className="text-sm text-white/35 mt-1 leading-relaxed">
                    Pick a character to represent you in the space.
                  </p>
                </div>

                {/* Avatar grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
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

                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                          <span className="text-[11px] font-medium text-white/80 block text-center">
                            {avatar.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Join button */}
                <div className="mt-8">
                  <Button
                    onClick={handleJoinRoom}
                    className="w-full h-12 text-sm font-medium rounded-xl bg-primaryBlue hover:bg-primaryBlue/90 text-white shadow-lg shadow-primaryBlue/20 hover:shadow-primaryBlue/30 transition-all duration-200 hover:-translate-y-px group disabled:opacity-40"
                    disabled={!canJoin}
                  >
                    Join Space
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
