import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UsersRoundIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { WebSocketSingleton } from "@/utils/websocket";
export const RoomParticipantsDialog = () => {
  console.log(WebSocketSingleton.getPlayers().at(0));
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105">
          <UsersRoundIcon />
          <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">
            {WebSocketSingleton.getPlayers().length}
          </Badge>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Participants</span>
            <Badge variant="secondary">
              {WebSocketSingleton.getPlayers().length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-72 w-full">
          {WebSocketSingleton.getPlayers().map((participant) => (
            <div
              key={participant.userId}
              className="flex items-center space-x-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              <Avatar>
                <AvatarImage
                  src={"/avatar_thumbnail/" + participant.avatarId + "-1.png"}
                  alt={participant.userName}
                />
              </Avatar>
              <span>{participant.userName}</span>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
