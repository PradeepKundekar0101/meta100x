import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
export const RoomDetailsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105">
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
  );
};
