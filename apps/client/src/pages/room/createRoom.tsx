import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/store/hooks";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import mapData from "@/mock/mapData.json";

import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import {
  Check,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Map as MapIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CreateDialog } from "./_components/create-dialog";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [mapId, setMapId] = useState(mapData[0].mapId);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const api = useAxios();
  const [roomCode, setRoomCode] = useState<undefined | string>(undefined);
  const [showDialog, setShowDialog] = useState(false);

  const mutation = useMutation({
    mutationKey: ["createroom"],
    mutationFn: async () => {
      return (
        await api.post("/room/", { roomName, creatorId: user?.id, mapId })
      ).data;
    },
    onSuccess: (data) => {
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

  return (
    <div className="min-h-screen w-full bg-background">
      <CreateDialog
        roomCode={roomCode!}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        {/* Back link */}
        <button
          onClick={() => navigate("/spaces")}
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-10 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to spaces
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Create a new space
          </h1>
          <p className="text-sm text-white/35 mt-1.5 leading-relaxed">
            Set up a virtual room for your team, friends, or community.
          </p>
        </div>

        {/* Form container */}
        <div className="space-y-8">
          {/* Space name */}
          <div className="space-y-2.5">
            <label className="text-[13px] font-medium text-white/50 block">
              Space name
            </label>
            <Input
              name="roomName"
              placeholder="e.g. The Chill Zone"
              onChange={(e) => setRoomName(e.target.value)}
              value={roomName}
              className="h-12 text-[15px] px-4 bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-primaryBlue/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-primaryBlue/20 transition-all duration-200 rounded-xl"
            />
          </div>

          {/* Map selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-white/50">
                Environment
              </label>
              <span className="text-[11px] text-white/25">
                {mapData.length} maps
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mapData.map((map) => (
                <button
                  key={map.mapId}
                  type="button"
                  onClick={() => setMapId(map.mapId)}
                  className={`group relative rounded-xl overflow-hidden text-left transition-all duration-300 outline-none ring-1 ${mapId === map.mapId
                      ? "ring-primaryBlue/60 shadow-lg shadow-primaryBlue/10"
                      : "ring-white/[0.07] hover:ring-white/[0.15]"
                    }`}
                >
                  <div className="aspect-[16/9] relative">
                    <img
                      src={map.thumbnail}
                      alt={map.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className={`absolute inset-0 transition-colors duration-300 ${mapId === map.mapId
                          ? "bg-primaryBlue/10"
                          : "bg-black/30 group-hover:bg-black/20"
                        }`}
                    />

                    {/* Selected check */}
                    <div
                      className={`absolute top-3 right-3 transition-all duration-200 ${mapId === map.mapId
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-75"
                        }`}
                    >
                      <div className="bg-primaryBlue text-white p-1 rounded-full shadow-md">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                    </div>

                    {/* Label */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex items-center gap-1.5">
                        <MapIcon className="h-3 w-3 text-white/50" />
                        <span className="text-[13px] font-medium text-white/90">
                          {map.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Submit */}
          <Button
            onClick={handleCreate}
            className="w-full h-12 text-sm font-medium rounded-xl bg-primaryBlue hover:bg-primaryBlue/90 text-white shadow-lg shadow-primaryBlue/20 hover:shadow-primaryBlue/30 transition-all duration-200 hover:-translate-y-px group"
            disabled={!roomName.trim() || mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Space
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
