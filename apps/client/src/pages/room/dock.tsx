import {  useRef, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import {WebSocketSingleton} from '@/utils/websocket';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Info,  LogOutIcon, UsersRoundIcon } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { TrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';

interface DockType {}

const Dock: React.FC<DockType> = () => {

  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const navigate = useNavigate();
  const controlBarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute bottom-2 media left-1/2 transform -translate-x-1/2 bg-[#0008] backdrop-blur-2xl p-2 px-10 flex justify-center rounded-full space-x-4">

      <div ref={controlBarRef} className="flex items-center space-x-4">
     
        <TrackToggle  className={`p-2 rounded-full
             bg-gray-700 text-white hover:bg-gray-600
         transition-all duration-300 ease-in-out hover:scale-105`} source={Track.Source.Microphone} />
        <TrackToggle  className={`p-2 rounded-full ${
           
             "bg-gray-700 text-white hover:bg-gray-600" 
           
        } transition-all duration-300 ease-in-out hover:scale-105`} source={Track.Source.Camera} />
        {/* <TrackToggle source={Track.Source.ScreenShare} /> */}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button 
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105"
          >
            <Info />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meeting Details</DialogTitle>
            <DialogDescription>
              <span className="mb-4">
                This is a collaborative meeting space designed to facilitate 
                remote communication and teamwork.
              </span>
              <div className="text-sm text-muted-foreground">
                Created 2 hours ago
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <button 
            className="relative p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105"
          >
            <UsersRoundIcon />
            <Badge 
              className="absolute -top-2 -right-2 px-2 py-1 text-xs"
            >
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
                  <AvatarImage src={"../../public/avatar_thumbnail/"+participant.avatarId+".png"} alt={participant.userName} />
                </Avatar>
                <span>{participant.userName}</span>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>

    
     
      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogTrigger asChild>
          <button 
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105"
          >
            <LogOutIcon/>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end your current meeting session. 
              You can rejoin later if the meeting is still active.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              navigate("/spaces")
              console.log("Exiting meeting");
            }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Dock;