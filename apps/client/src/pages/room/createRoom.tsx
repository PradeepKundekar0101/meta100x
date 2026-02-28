import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/store/hooks";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import mapData from "@/mock/mapData.json";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import {
  Check,
  Loader2,
  Sparkles,
  Gamepad2,
  ArrowRight,
  LayoutGrid
} from "lucide-react";

import { CreateDialog } from "./_components/create-dialog";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [mapId, setMapId] = useState(mapData[0].mapId);
  const { user } = useAppSelector((state) => state.auth);

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

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full relative overflow-hidden bg-background">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primaryBlue/5 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      </div>

      <CreateDialog roomCode={roomCode!} showDialog={showDialog} setShowDialog={setShowDialog} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left Column: Form & Info */}
          <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-24">
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primaryBlue/10 text-primaryBlue text-xs font-medium tracking-wider uppercase">
                <span>Virtual Space</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-orbitron font-bold tracking-tight text-foreground leading-[1.1]">
                Design Your <br />
                <span className="text-primaryBlue">
                  Universe
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Create a persistent virtual space for your team, friends, or community.
                Choose a map, name it, and invite others to join.
              </p>
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider ml-1">
                  Space Name
                </Label>
                <div className="relative group">
                  <Input
                    name="roomName"
                    placeholder="e.g. The Chill Zone"
                    onChange={(e) => setRoomName(e.target.value)}
                    value={roomName}
                    className="h-14 text-xl px-6 bg-secondary/30 border-2 border-transparent focus:border-primaryBlue/20 focus:bg-background transition-all duration-300 rounded-2xl shadow-sm group-hover:bg-secondary/50"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 pointer-events-none">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreate}
                className="w-full h-14 text-lg font-medium rounded-2xl bg-primaryBlue hover:bg-primaryBlue/90 shadow-lg shadow-primaryBlue/25 hover:shadow-primaryBlue/40 transition-all duration-300 hover:-translate-y-0.5 group"
                disabled={!roomName.trim() || mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    Create Space
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column: Map Selection */}
          <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-primaryBlue" />
                <h2 className="text-xl font-semibold font-orbitron tracking-wide">Select Environment</h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {mapData.length} available maps
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mapData.map((map) => (
                <div
                  key={map.mapId}
                  onClick={() => setMapId(map.mapId)}
                  className={`group relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 ease-out ${mapId === map.mapId
                    ? "ring-4 ring-primaryBlue ring-offset-4 ring-offset-background shadow-2xl scale-[1.02] z-10"
                    : "hover:shadow-xl hover:-translate-y-2 hover:ring-2 hover:ring-primaryBlue/20 opacity-80 hover:opacity-100 grayscale-[0.3] hover:grayscale-0"
                    }`}
                >
                  <div className="aspect-[16/10] relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${map.thumbnail})`,
                      }}
                    />

                    {/* Overlay Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${mapId === map.mapId ? "opacity-80" : "opacity-60 group-hover:opacity-70"
                      }`} />

                    {/* Selection Indicator */}
                    <div className={`absolute top-4 right-4 transition-all duration-300 transform ${mapId === map.mapId ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      }`}>
                      <div className="bg-primaryBlue text-white p-2 rounded-full shadow-lg shadow-primaryBlue/40">
                        <Check className="w-4 h-4" strokeWidth={4} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                      <h3 className="text-xl font-bold mb-2 font-orbitron tracking-wide text-shadow-lg">
                        {map.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                        {map.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
