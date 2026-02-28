import React from "react";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Loader2,
  Copy,
  Map as MapIcon,
  MoreVertical,
  ArrowRight,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import useAxios from "@/hooks/use-axios";
import { useAppSelector } from "@/store/hooks";
import { Space } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import mapData from "@/mock/mapData.json";
import { Link, useNavigate } from "react-router-dom";

const SpaceRow = ({
  space,
  index,
}: {
  space: Space;
  index: number;
}) => {
  const { toast } = useToast();
  const api = useAxios();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (spaceId: string) => {
      return await api.delete(`/room/${spaceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myspaces"] });
      toast({
        title: "Space Deleted",
        description: "The space has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the space.",
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({
      spaceId,
      roomName,
    }: {
      spaceId: string;
      roomName: string;
    }) => {
      return await api.patch(`/room/${spaceId}`, { roomName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myspaces"] });
      toast({
        title: "Space Updated",
        description: "The space details have been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the space.",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (spaceId: string) => {
      return await api.put(`/room/toggleActive/${spaceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myspaces"] });
      toast({
        title: "Status Updated",
        description: "The space active status has been changed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update space status.",
        variant: "destructive",
      });
    },
  });

  const getMapThumbnail = (mapId: string) => {
    const map = mapData.find((m) => m.mapId === mapId);
    return map ? `/${map.thumbnail}` : null;
  };

  const getMapName = (mapId: string) => {
    const map = mapData.find((m) => m.mapId === mapId);
    return map?.title ?? "Unknown";
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard.",
    });
  };

  const EditSpaceDialog = ({
    open,
    setOpen,
  }: {
    open: boolean;
    setOpen: (val: boolean) => void;
  }) => {
    const [roomName, setRoomName] = React.useState(space.roomName);

    const handleEdit = () => {
      editMutation.mutate(
        { spaceId: space.id, roomName },
        { onSuccess: () => setOpen(false) }
      );
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Space</DialogTitle>
            <DialogDescription>
              Update the name of your space.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editRoomName">Space Name</Label>
              <Input
                id="editRoomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={editMutation.isPending}>
              {editMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div
        className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_minmax(100px,auto)_minmax(100px,auto)_auto_auto] items-center gap-4 md:gap-6 px-4 md:px-6 py-4 border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors duration-200"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Thumbnail + Name */}
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-white/[0.05] flex-shrink-0 ring-1 ring-white/[0.08]">
          {getMapThumbnail(space.mapId) ? (
            <img
              src={getMapThumbnail(space.mapId)!}
              alt={space.roomName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapIcon className="h-5 w-5 text-white/20" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[15px] font-medium text-white truncate">
              {space.roomName}
            </h3>
            <span
              className={`flex-shrink-0 w-2 h-2 rounded-full ${
                space.isActive
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  : "bg-white/20"
              }`}
            />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-white/40">{getMapName(space.mapId)}</span>
            <span className="text-white/20 text-[10px]">&middot;</span>
            <span className="text-xs text-white/30">
              {new Date(space.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Room code — hidden on mobile, shown in dropdown */}
        <div className="hidden md:flex items-center gap-1.5">
          <code className="text-xs font-mono text-white/50 bg-white/[0.05] px-2.5 py-1 rounded-md border border-white/[0.06]">
            {space.roomCode}
          </code>
          <button
            onClick={() => copyRoomCode(space.roomCode)}
            className="p-1 rounded-md text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Toggle — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <Switch
            id={`active-${space.id}`}
            checked={space.isActive}
            onCheckedChange={() => toggleActiveMutation.mutate(space.id)}
            disabled={toggleActiveMutation.isPending}
            className="scale-90"
          />
          <label
            htmlFor={`active-${space.id}`}
            className="text-xs text-white/40 cursor-pointer select-none"
          >
            {space.isActive ? "Active" : "Inactive"}
          </label>
        </div>

        {/* Join button */}
        <Button
          size="sm"
          variant="ghost"
          className="hidden md:inline-flex text-primaryBlue hover:text-primaryBlue hover:bg-primaryBlue/10 gap-1.5 text-xs font-medium rounded-lg px-3"
          asChild
        >
          <Link to={`/space/${space.roomCode}`}>
            Join
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>

        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild className="md:hidden">
              <Link to={`/space/${space.roomCode}`}>
                <ExternalLink className="mr-2 h-4 w-4" /> Join Space
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="md:hidden"
              onClick={() => copyRoomCode(space.roomCode)}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Code: {space.roomCode}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="md:hidden" />
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="md:hidden"
              onClick={() => toggleActiveMutation.mutate(space.id)}
            >
              <MapIcon className="mr-2 h-4 w-4" />
              {space.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400 focus:bg-red-400/10"
              onClick={() => deleteMutation.mutate(space.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Space
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditSpaceDialog open={isEditOpen} setOpen={setIsEditOpen} />
    </>
  );
};

const MyRooms = () => {
  const api = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myspaces"],
    queryFn: async () => {
      return (await api.get(`/room/user/${user?.id}`)).data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primaryBlue" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-red-400 font-medium text-sm">
          Error loading spaces
        </div>
        <p className="text-white/40 text-sm">{(error as Error).message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["myspaces"] })
          }
          className="border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05]"
        >
          Retry
        </Button>
      </div>
    );
  }

  const spaces: Space[] = data?.data ?? [];

  return (
    <main className="container mx-auto px-4 pt-20 pb-12 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <h1 className="text-2xl text-white font-semibold tracking-tight">
            My Spaces
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {spaces.length} space{spaces.length !== 1 && "s"} &middot; Manage
            your virtual rooms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/space/join")}
            className="text-white/50 hover:text-white hover:bg-white/[0.05] text-xs font-medium rounded-lg"
          >
            Join by code
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/createroom")}
            className="bg-primaryBlue hover:bg-primaryBlue/90 text-white text-xs font-medium rounded-lg gap-1.5 shadow-lg shadow-primaryBlue/20"
          >
            <Plus className="h-3.5 w-3.5" />
            New Space
          </Button>
        </div>
      </div>

      {spaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.01]">
          <div className="bg-white/[0.04] p-5 rounded-2xl mb-5 ring-1 ring-white/[0.06]">
            <MapIcon className="h-7 w-7 text-white/20" />
          </div>
          <h3 className="text-base text-white font-medium mb-1.5">
            No spaces yet
          </h3>
          <p className="text-white/35 text-sm mb-6 max-w-xs leading-relaxed">
            Create your first space to start hosting virtual meetings and
            hangouts.
          </p>
          <Button
            size="sm"
            onClick={() => navigate("/createroom")}
            className="bg-primaryBlue hover:bg-primaryBlue/90 text-white text-xs font-medium rounded-lg gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Space
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden backdrop-blur-sm">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[auto_1fr_minmax(100px,auto)_minmax(100px,auto)_auto_auto] items-center gap-6 px-6 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="w-12" />
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">
              Space
            </span>
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">
              Room Code
            </span>
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">
              Status
            </span>
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">
              &nbsp;
            </span>
            <span className="w-7" />
          </div>

          {/* Rows */}
          {spaces.map((space: Space, i: number) => (
            <SpaceRow key={space.id} space={space} index={i} />
          ))}
        </div>
      )}
    </main>
  );
};

export default MyRooms;
