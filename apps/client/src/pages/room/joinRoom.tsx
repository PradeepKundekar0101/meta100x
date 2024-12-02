import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const JoinRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAxios();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const [roomCode, setRoomCode] = useState<string | undefined>(
    searchParams.get("roomCode") || ""
  );
  const [roomDetails, setRoomDetails] = useState<any | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    user?.avatarId
  );
  const [loading, setLoading] = useState(false);

  const prevAvatarId = user?.avatarId;

  // Fetch room details
  const fetchRoomDetails = async () => {
    if (!roomCode?.trim()) {
      toast.error("Please enter a valid room code");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/room/code/${roomCode}`);
      setRoomDetails(data.data);
      console.log(data.data)
      toast.success("Room details loaded!");
    } catch (error: any) {
      toast.error("Failed to fetch room details");
      console.log(error.message);
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
    navigate(`/space/${roomCode}`);
  };

  useEffect(() => {
    if (searchParams.get("roomCode")) {
      fetchRoomDetails();
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Join a Room
          </CardTitle>
          <CardDescription>Enter the room code or select an avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              name="roomCode"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={fetchRoomDetails}
              className="mt-4"
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Details"}
            </Button>
          </div>

          {roomDetails && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Room Details
              </h2>
              <p className="text-gray-600">Name: {roomDetails.roomName}</p>
              <p className="text-gray-600">Creator: {roomDetails.creator.userName}</p>
              <p className="text-gray-600">Email: {roomDetails.creator.email}</p>
            </div>
          )}

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
                      src={"../../"+avatar.thumbnail}
                      alt={avatar.name}
                      className="w-20 h-20 object-cover rounded-full mb-2"
                    />
                    <h3 className="text-sm text-center">{avatar.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button
            onClick={handleJoinRoom}
            className="w-full mt-6"
            size="lg"
            disabled={!roomDetails || !selectedAvatar}
          >
            Join Room
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default JoinRoom;
