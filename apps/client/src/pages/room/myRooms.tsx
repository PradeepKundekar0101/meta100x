import React from "react";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Plus,
  Loader2,
  Copy,
  Map as MapIcon,
  MoreVertical,
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
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import mapData from "@/mock/mapData.json";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";

const CreateSpaceDialog = () => {
  const { toast } = useToast();
  const api = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  const [roomName, setRoomName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedMapId, setSelectedMapId] = React.useState(mapData[0]?.mapId);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreate = async () => {
    if (!roomName.trim()) {
      toast({
        title: "Validation Error",
        description: "Space name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/room", {
        roomName,
        mapId: selectedMapId,
        creatorId: user?.id,
      });
      queryClient.invalidateQueries({ queryKey: ["myspaces"] });
      toast({
        title: "Space Created",
        description: "A new space has been successfully added.",
      });
      setRoomName("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create a new space.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Space
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
          <DialogDescription>
            Give your space a name and choose a map template.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="roomName">Space Name</Label>
            <Input
              id="roomName"
              placeholder="e.g., Weekly Standup, Chill Zone"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Select Map</Label>
            <div className="grid grid-cols-2 gap-4">
              {mapData.map((map) => (
                <div
                  key={map.mapId}
                  className={cn(
                    "cursor-pointer border rounded-lg overflow-hidden relative transition-all",
                    selectedMapId === map.mapId
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => setSelectedMapId(map.mapId)}
                >
                  <img
                    src={`/assets/${map.thumbnail}`}
                    alt={map.title}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2 bg-card">
                    <p className="font-medium text-sm">{map.title}</p>
                  </div>
                  {selectedMapId === map.mapId && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <MapIcon className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Space
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SpaceCard = ({ space }: { space: Space }) => {
  const { toast } = useToast();
  const api = useAxios();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  // Delete Space Mutation
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

  // Edit Space Mutation
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

  // Toggle Active Status Mutation
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
    return map ? `/assets/${map.thumbnail}` : null;
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard.",
    });
  };

  // Edit Space Dialog Component (Local to SpaceCard to avoid prop drilling complex states)
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
        {
          spaceId: space.id,
          roomName,
        },
        {
          onSuccess: () => setOpen(false),
        }
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
    <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-40 bg-muted">
        {getMapThumbnail(space.mapId) ? (
          <img
            src={getMapThumbnail(space.mapId)!}
            alt={space.roomName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <MapIcon className="h-12 w-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={space.isActive ? "default" : "secondary"}
            className={space.isActive ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {space.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl truncate" title={space.roomName}>
              {space.roomName}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Created {new Date(space.createdAt).toLocaleDateString()}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyRoomCode(space.roomCode)}>
                <Copy className="mr-2 h-4 w-4" /> Copy Room Code
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => deleteMutation.mutate(space.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Space
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <div className="space-y-4 mt-2">
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
            <span className="text-sm font-medium">Room Code</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-background px-2 py-1 rounded border">
                {space.roomCode}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyRoomCode(space.roomCode)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor={`active-${space.id}`}
              className="text-sm cursor-pointer"
            >
              Space Active
            </Label>
            <Switch
              id={`active-${space.id}`}
              checked={space.isActive}
              onCheckedChange={() => toggleActiveMutation.mutate(space.id)}
              disabled={toggleActiveMutation.isPending}
            />
          </div>
        </div>
        <Button
          className="w-full mt-4 rounded-full border-primaryBlue text-primaryBlue"
          variant={"outline"}
          asChild
        >
          <Link to={`/space/${space.roomCode}`}>Join Space</Link>
        </Button>
        <EditSpaceDialog open={isEditOpen} setOpen={setIsEditOpen} />
      </CardContent>
    </Card>
  );
};

const MyRooms = () => {
  const api = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  // Fetch Spaces
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myspaces"],
    queryFn: async () => {
      return (await api.get(`/room/user/${user?.id}`)).data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-destructive font-medium">Error loading spaces</div>
        <p className="text-muted-foreground">{(error as Error).message}</p>
        <Button
          variant="outline"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["myspaces"] })
          }
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-20 max-w-7xl">
      <div className="flex relative flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My{" "}
            <span className=" text-primaryBlue font-medium italic">Spaces</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your virtual spaces and rooms.
          </p>
        </div>
        <div>
          <Button
            onClick={() => {
              navigate("/space/join");
            }}
          >
            Join by room ID
          </Button>
        </div>
      </div>

      {data?.data && data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/30">
          <div className="bg-muted p-4 rounded-full mb-4">
            <MapIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No spaces yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create your first space to start hosting virtual meetings and
            hangouts.
          </p>
          <CreateSpaceDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((space: Space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </main>
  );
};

export default MyRooms;
