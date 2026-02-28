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
import { Check, Copy, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateDialogProps = {
    roomCode: string;
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateDialog: React.FC<CreateDialogProps> = ({
    roomCode,
    showDialog,
    setShowDialog,
}) => {
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
            <DialogContent className="sm:max-w-lg border border-white/[0.08] shadow-2xl max-h-[90vh] flex flex-col p-0 gap-0 bg-[#0a0a0a] overflow-hidden rounded-2xl">
                {/* Header */}
                <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <Check className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-semibold text-white">
                                    Space created
                                </DialogTitle>
                                <p className="text-xs text-white/35 mt-0.5">
                                    Share the invite code to let others join.
                                </p>
                            </div>
                        </div>

                        {/* Room code row */}
                        <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3 mt-2">
                            <div>
                                <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest block">
                                    Invite Code
                                </span>
                                <span className="text-lg font-mono font-semibold text-white tracking-widest">
                                    {roomCode}
                                </span>
                            </div>
                            <button
                                onClick={handleCopyRoomCode}
                                className={cn(
                                    "p-2.5 rounded-lg transition-all duration-200",
                                    copied
                                        ? "bg-emerald-500/15 text-emerald-400"
                                        : "bg-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.1]"
                                )}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </DialogHeader>
                </div>

                {/* Avatar selection */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-[13px] font-medium text-white/50">
                            Choose avatar
                        </label>
                        <span className="text-[11px] text-white/25">
                            {avatarData.length} characters
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5">
                        {avatarData.map((avatar) => (
                            <button
                                key={avatar.id}
                                type="button"
                                onClick={() => setSelectedAvatar(avatar.id)}
                                className={cn(
                                    "group relative rounded-xl overflow-hidden aspect-square outline-none ring-1 transition-all duration-200",
                                    selectedAvatar === avatar.id
                                        ? "ring-primaryBlue/60 shadow-lg shadow-primaryBlue/10 scale-[1.03] z-10"
                                        : "ring-white/[0.07] hover:ring-white/[0.15] opacity-70 hover:opacity-100"
                                )}
                            >
                                <img
                                    src={avatar.thumbnail}
                                    alt={avatar.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                <div
                                    className={cn(
                                        "absolute inset-0 transition-colors duration-200",
                                        selectedAvatar === avatar.id
                                            ? "bg-primaryBlue/10"
                                            : "bg-black/30 group-hover:bg-black/15"
                                    )}
                                />

                                <div
                                    className={cn(
                                        "absolute top-1.5 right-1.5 transition-all duration-150",
                                        selectedAvatar === avatar.id
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-75"
                                    )}
                                >
                                    <div className="bg-primaryBlue text-white p-0.5 rounded-full shadow-md">
                                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                    </div>
                                </div>

                                <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
                                    <span className="text-[10px] font-medium text-white/80 block text-center">
                                        {avatar.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-2">
                    <Button
                        onClick={handleJoinRoom}
                        className="w-full h-11 text-sm font-medium rounded-xl bg-primaryBlue hover:bg-primaryBlue/90 text-white shadow-lg shadow-primaryBlue/20 hover:shadow-primaryBlue/30 transition-all duration-200 hover:-translate-y-px group"
                    >
                        Enter Space
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
