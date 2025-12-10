import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import mapData from "@/mock/mapData.json";
import avatarData from "@/mock/avatars.json";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  Copy,
  Loader2,
  Gamepad2,
  Map as MapIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/store/slices/authSlice";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [mapId, setMapId] = useState(mapData[0].mapId);
  const { user, token } = useAppSelector((state) => state.auth);
  const prevAvatarId = user?.avatarId;
  const api = useAxios();
  const [roomCode, setRoomCode] = useState<undefined | string>(undefined);
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    user?.avatarId
  );
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationKey: ["createroom"],
    mutationFn: async () => {
      return (
        await api.post("/room/", { roomName, creatorId: user?.id, mapId })
      ).data;
    },
    onSuccess: (data) => {
      console.log(data.data);
      setRoomCode(data.data.roomCode);
      setShowDialog(true);
      toast.success("Space created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create room");
      console.log(error.message);
    },
  });

  const handleCreate = async () => {
    if (roomName.trim()) {
      mutation.mutate();
      localStorage.setItem("mapId", mapId);
    } else {
      toast.error("Please enter a room name");
    }
  };

  const handleCopyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Room code copied!");
    }
  };

  const updateAvatarMutation = useMutation({
    mutationKey: ["updateAvatar"],
    mutationFn: async () => {
      return (
        await api.patch("/user/" + user?.id + "/avatar", {
          avatarId: selectedAvatar,
        })
      ).data;
    },
    onSuccess: () => {
      dispatch(
        login({
          user: { ...user!, avatarId: selectedAvatar || "pajji" },
          token,
        })
      );
      localStorage.setItem("avatarId", selectedAvatar || "");
    },
  });

  const handleJoinRoom = () => {
    if (selectedAvatar !== prevAvatarId) {
      updateAvatarMutation.mutate();
    }
    localStorage.setItem("roomId", roomCode!);
    navigate("/space/" + roomCode);
  };

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
    <div className="max-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[900px] border-none shadow-2xl h-[85vh] flex flex-col p-0 gap-0 bg-white/95 backdrop-blur-xl">
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center text-primaryBlue">
                Room Created!
              </DialogTitle>
              <DialogDescription className="text-center text-gray-500">
                Share this code with your friends to invite them
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">
            <div className="relative group">
              <div className="flex items-center justify-between bg-white border-2 border-gray-100 p-4 rounded-xl shadow-sm hover:border-primaryBlue/20 transition-colors">
                <span className="text-2xl font-mono font-bold tracking-wider text-gray-800 pl-4">
                  {roomCode}
                </span>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleCopyRoomCode}
                  className="hover:bg-primaryBlue hover:text-white transition-all duration-300"
                >
                  {copied ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 relative">
              <div className="flex items-center gap-2 mb-4">
                <Gamepad2 className="h-5 w-5 text-primaryBlue" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Choose Your Character
                </h2>
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
                          src={avatar.thumbnail}
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
          </div>

          <div className="p-6 pt-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm mt-auto">
            <Button
              onClick={handleJoinRoom}
              className="w-full h-12 text-lg bg-primaryBlue hover:bg-primaryBlue/90 shadow-lg shadow-primaryBlue/20 transition-all duration-300 hover:scale-[1.02]"
            >
              Enter Space
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto border-y border-dashed border-primaryBlue/50 pt-10">
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Create Your{" "}
            <span className="text-primaryBlue italic font-medium">Space</span>
          </h1>
          <p className="text-lg text-gray-500">
            Select the perfect place for your gathering
          </p>
        </div>

        <Card className="border-none shadow-none backdrop-blur-sm overflow-hidden">
          <CardContent className="px-8">
            <div className="space-y-8">
              {/* Space Name Section */}
              <div className="space-y-4 max-w-md">
                <Label className="text-base font-semibold text-gray-800">
                  Name your space
                </Label>
                <Input
                  name="roomName"
                  placeholder="e.g. Chill Zone, Daily Standup, Friday Party..."
                  onChange={(e) => setRoomName(e.target.value)}
                  value={roomName}
                  className="h-12 text-lg px-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-full"
                />
              </div>

              {/* Map Selection Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-primaryBlue" />
                  <Label className="text-base font-semibold text-gray-800">
                    Choose a vibe
                  </Label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mapData.map((map) => (
                    <div
                      key={map.mapId}
                      onClick={() => setMapId(map.mapId)}
                      className={`group relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                        mapId === map.mapId
                          ? "ring-4 ring-primaryBlue ring-offset-4 shadow-xl scale-[1.02]"
                          : "hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-gray-200"
                      }`}
                    >
                      <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: `url(assets/${map.thumbnail})`,
                          }}
                        />

                        {/* Overlay Gradient */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                            mapId === map.mapId
                              ? "opacity-90"
                              : "opacity-60 group-hover:opacity-80"
                          }`}
                        />

                        {/* Selected Indicator */}
                        {mapId === map.mapId && (
                          <div className="absolute top-3 right-3 bg-primaryBlue text-white p-2 rounded-full shadow-lg animate-in fade-in zoom-in duration-300">
                            <Check className="w-4 h-4" strokeWidth={3} />
                          </div>
                        )}

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                          <h3 className="text-xl font-bold mb-1 text-shadow-sm">
                            {map.title}
                          </h3>
                          <p className="text-sm text-gray-200 line-clamp-2 opacity-90">
                            {map.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button
                  onClick={handleCreate}
                  className="h-12 px-8 text-lg bg-primaryBlue hover:bg-primaryBlue/90 shadow-lg shadow-primaryBlue/20 transition-all hover:scale-[1.02]"
                  disabled={!roomName.trim() || mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Space...
                    </>
                  ) : (
                    "Create Space"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRoom;
