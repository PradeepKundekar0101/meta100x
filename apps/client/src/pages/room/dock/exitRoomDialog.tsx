import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ExitRoomDialog = ({
  isExitDialogOpen,
  setIsExitDialogOpen,
}: {
  isExitDialogOpen: boolean;
  setIsExitDialogOpen: (isExitDialogOpen: boolean) => void;
}) => {
  const navigate = useNavigate();
  return (
    <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
      <AlertDialogTrigger asChild>
        <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 ease-in-out hover:scale-105">
          <LogOutIcon />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Are you sure you want to leave?</AlertDialogTitle>
          <AlertDialogDescription>
            This will end your current meeting session. You can rejoin later if
            the meeting is still active.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              navigate("/spaces");
              console.log("Exiting meeting");
            }}
          >
            <span className="text-white">Continue</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
