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
        <button className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105">
          <LogOutIcon />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
          <AlertDialogDescription>
            This will end your current meeting session. You can rejoin later if
            the meeting is still active.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              navigate("/spaces");
              console.log("Exiting meeting");
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
