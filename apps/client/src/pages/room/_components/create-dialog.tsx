import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import avatarData from "@/mock/avatars.json";
import { login } from "@/store/slices/authSlice";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, Copy, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateDialogProps = {
    roomCode: string,
    showDialog: boolean,
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreateDialog: React.FC<CreateDialogProps> = ({ roomCode, showDialog, setShowDialog }) => {
    const api = useAxios();
    const [copied, setCopied] = useState(false);
    const { user, token } = useAppSelector((state) => state.auth);
    const prevAvatarId = user?.avatarId;
    const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
        user?.avatarId
    );
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleCopyRoomCode = () => {
        if (roomCode) {
            navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Room code copied!");
        }
    };

    const updateAvatarMutation = useMutation({
        mutationKey: ["updateAvatar"],
        mutationFn: async () => {
            return (
                await api.patch("/user/" + user?.id + "/avatar", {
                    avatarId: selectedAvatar,
                })
            ).data;
        },
        onSuccess: () => {
            dispatch(
                login({
                    user: { ...user!, avatarId: selectedAvatar || "pajji" },
                    token,
                })
            );
            localStorage.setItem("avatarId", selectedAvatar || "");
        },
    });

    const handleJoinRoom = () => {
        if (selectedAvatar !== prevAvatarId) {
            updateAvatarMutation.mutate();
        }
        localStorage.setItem("roomId", roomCode!);
        navigate("/space/" + roomCode);
    };

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-4xl border-none shadow-2xl max-h-[90vh] flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-xl overflow-hidden">

                {/* Header Section */}
                <div className="p-8 pb-6 border-b border-border/40 bg-muted/20">
                    <DialogHeader className="space-y-4">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                                <Check className="w-8 h-8" />
                            </div>
                            <DialogTitle className="text-3xl font-orbitron font-bold tracking-wide">
                                Space Ready!
                            </DialogTitle>
                            <p className="text-muted-foreground text-lg max-w-md">
                                Your virtual universe has been created.
                            </p>
                        </div>

                        {/* Room Code Card */}
                        <div className="max-w-md mx-auto w-full mt-6">
                            <div className="relative group overflow-hidden rounded-2xl border-2 border-primaryBlue/20 bg-background shadow-sm hover:shadow-md hover:border-primaryBlue/40 transition-all duration-300">
                                <div className="flex items-center justify-between p-1 pl-5">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Invite Code</span>
                                        <span className="text-2xl font-mono font-bold tracking-widest text-foreground">
                                            {roomCode}
                                        </span>
                                    </div>
                                    <Button
                                        size="icon"
                                        onClick={handleCopyRoomCode}
                                        className={cn(
                                            "h-12 w-12 rounded-xl transition-all duration-300",
                                            copied ? "bg-green-500 hover:bg-green-600 text-white" : "bg-primaryBlue/10 text-primaryBlue hover:bg-primaryBlue hover:text-white"
                                        )}
                                    >
                                        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Avatar Selection Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primaryBlue/10 text-primaryBlue">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Choose Identity</h2>
                            <p className="text-sm text-muted-foreground">Select how you'll appear in the space</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {avatarData.map((avatar) => (
                            <div
                                key={avatar.id}
                                onClick={() => setSelectedAvatar(avatar.id)}
                                className={cn(
                                    "group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 aspect-square",
                                    selectedAvatar === avatar.id
                                        ? "ring-4 ring-primaryBlue ring-offset-2 ring-offset-background shadow-xl scale-[1.02]"
                                        : "hover:ring-2 hover:ring-primaryBlue/50 hover:shadow-lg hover:-translate-y-1 opacity-80 hover:opacity-100"
                                )}
                            >
                                <div className="absolute inset-0 bg-muted">
                                    <img
                                        src={avatar.thumbnail}
                                        alt={avatar.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Overlay & Selection Indicator */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300",
                                    selectedAvatar === avatar.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )} />

                                {selectedAvatar === avatar.id && (
                                    <div className="absolute top-2 right-2 bg-primaryBlue text-white p-1.5 rounded-full shadow-lg animate-in fade-in zoom-in duration-200">
                                        <Check className="w-3 h-3" strokeWidth={4} />
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                                    <span className="text-sm font-bold tracking-wide text-shadow-sm block text-center">
                                        {avatar.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-border/40 bg-muted/20 backdrop-blur-sm">
                    <Button
                        onClick={handleJoinRoom}
                        className="w-full h-14 text-lg font-medium rounded-xl bg-primaryBlue hover:bg-primaryBlue/90 shadow-lg shadow-primaryBlue/25 hover:shadow-primaryBlue/40 transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                        Enter Space
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
