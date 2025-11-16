import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";
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
    user?.avatarId,
  );
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);
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
      toast.success("Space created!");
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
      toast.error("Please ente\r a room name");
    }
  };

  const handleCopyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        }),
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

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Room Created!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <span className="text-xl font-semibold tracking-wider">
                {roomCode}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyRoomCode}
                className="hover:bg-gray-200"
              >
                {copied ? <Check className="text-green-600" /> : <Copy />}
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Select Your Avatar</h2>
              <div className="grid grid-cols-5 gap-3">
                {avatarData.map((avatar) => (
                  <Card
                    key={avatar.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedAvatar === avatar.id
                        ? "border-2 border-primaryBlue scale-105"
                        : "border-gray-200 hover:border-primaryBlue/50"
                    }`}
                    onClick={() => setSelectedAvatar(avatar.id)}
                  >
                    <CardContent className="flex flex-col justify-center items-center p-3">
                      <img
                        src={avatar.thumbnail}
                        alt={avatar.name}
                        className="w-20 h-20 object-cover rounded-full mb-2"
                      />
                      <h3 className="text-sm text-center">{avatar.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button onClick={handleJoinRoom} className="w-full" size="lg">
              Join Room
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Create Your Space
          </CardTitle>
          <CardDescription>
            Design a unique room for your gathering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label className="text-gray-700 mb-2 block">Space Name</Label>
            <Input
              name="roomName"
              placeholder="Enter a creative name for your space"
              onChange={(e) => setRoomName(e.target.value)}
              value={roomName}
              className="w-full"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Choose Your Map
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mapData.map((map) => (
                <Card
                  key={map.mapId}
                  className={`cursor-pointer transition-all duration-300 ${
                    mapId === map.mapId
                      ? "border-2 border-primaryBlue scale-105 shadow-lg"
                      : "border-gray-200 hover:border-primaryBlue/50 hover:shadow-md"
                  }`}
                  onClick={() => setMapId(map.mapId)}
                >
                  <CardHeader className="p-0">
                    <img
                      className="h-48 w-full object-cover rounded-t-lg"
                      src={`assets/${map.thumbnail}`}
                      alt={map.title}
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardDescription>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">
                        {map.title}
                      </h3>
                      <p className="text-gray-600">{map.description}</p>
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleCreate}
              className="bg-primaryBlue hover:bg-primaryBlue/90 transition-colors"
              size="lg"
              disabled={!roomName.trim()}
            >
              Create Space
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateRoom;
