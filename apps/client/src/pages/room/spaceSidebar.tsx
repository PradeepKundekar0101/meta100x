import React, { useEffect, useState, useRef } from "react";
import {
  MessageSquare,
  Users,
  Info,
  Send,
  X,
  Hash,
  Copy,
  Check,
  Circle,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WebSocketSingleton } from "@/utils/websocket";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/use-axios";
import axios from "axios";

type TabId = "chat" | "people" | "details";

interface SpaceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
  roomCode: string;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

interface Message {
  id: string;
  content: string;
  userName: string;
  createdAt: string;
  avatarId: string;
  isCurrentUser: boolean;
}

const TAB_CONFIG: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "people", label: "People", icon: Users },
  { id: "details", label: "Details", icon: Info },
];

const SpaceSidebar: React.FC<SpaceSidebarProps> = ({
  isOpen,
  onClose,
  roomId,
  roomName,
  roomCode,
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-screen w-[360px] z-40 transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <div className="h-full flex flex-col bg-[#0c0c14]/90 backdrop-blur-xl border-l border-white/[0.06]">
        <SidebarHeader activeTab={activeTab} onTabChange={onTabChange} onClose={onClose} roomCode={roomCode} />

        <div className="flex-1 min-h-0">
          {activeTab === "chat" && <ChatPanel roomId={roomId} />}
          {activeTab === "people" && <PeoplePanel />}
          {activeTab === "details" && (
            <DetailsPanel roomName={roomName} roomCode={roomCode} />
          )}
        </div>
      </div>
    </div>
  );
};

const SidebarHeader: React.FC<{
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onClose: () => void;
  roomCode: string;
}> = ({ activeTab, onTabChange, onClose, roomCode }) => {
  const [copied, setCopied] = useState(false);
  const joinUrl = `https://usemetaworld.com/space/join?code=${roomCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="shrink-0">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-white/50 text-[11px] font-medium tracking-widest uppercase">
          Space Panel
        </span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] hover:ring-white/[0.12] transition-all group">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-0.5">
              Invite Link
            </p>
            <p className="text-[13px] text-white/70 font-mono truncate">
              {joinUrl}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-white/30 hover:text-white/90 hover:bg-white/[0.08] transition-all shrink-0"
            title="Copy link"
          >
            {copied ? (
              <Check size={16} className="text-emerald-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-1 px-3 pb-3 pt-2">
        {TAB_CONFIG.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#6658fe]/15 text-[#a49bff] shadow-[inset_0_0_0_1px_rgba(102,88,254,0.2)]"
                  : "text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
};

const ChatPanel: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { user, token } = useAppSelector((state) => state.auth);
  const isGuest = !user || !token;
  const effectiveUserId = user?.id ?? localStorage.getItem("guestId") ?? "guest";
  const effectiveUserName =
    user?.userName ?? localStorage.getItem("guestName") ?? "Guest";
  const api = useAxios();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      if (isGuest) {
        return (
          await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/chats/${roomId}`
          )
        ).data;
      }
      return (await api.get("/chats/" + roomId)).data;
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (data?.data) {
      const msg: Message[] = data.data.chats.map(
        (e: {
          sender: { userName: string; avatarId: string; id: string };
          createdAt: string;
          content: string;
        }) => ({
          userName: e.sender.userName,
          avatarId: e.sender.avatarId,
          createdAt: e.createdAt,
          content: e.content,
          id: e.sender.id,
          isCurrentUser: e.sender.id === effectiveUserId,
        })
      );
      setMessages(msg);
    }
  }, [data, effectiveUserId]);

  useEffect(() => {
    const unsub = WebSocketSingleton.subscribe(
      "CHAT_MESSAGE_SERVER",
      (msg) => {
        const { avatarId, userName, createdAt, content, userId } =
          msg.payload as {
            avatarId: string;
            userName: string;
            createdAt: string;
            content: string;
            userId: string;
          };
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            content,
            userName: userId === effectiveUserId ? "You" : userName,
            createdAt,
            avatarId,
            isCurrentUser: userId === effectiveUserId,
          },
        ]);
      }
    );
    return () => unsub();
  }, [effectiveUserId]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    if (WebSocketSingleton.getInstance().readyState === WebSocket.OPEN) {
      WebSocketSingleton.getInstance().send(
        JSON.stringify({
          type: "CHAT_MESSAGE_CLIENT",
          payload: {
            token: token ?? undefined,
            content: inputMessage,
            userName: effectiveUserName,
            avatarId: localStorage.getItem("avatarId") || "pajji",
          },
        })
      );
    }
    setInputMessage("");
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
                <MessageSquare size={20} className="text-white/20" />
              </div>
              <p className="text-white/25 text-sm">No messages yet</p>
              <p className="text-white/15 text-xs mt-1">
                Start the conversation
              </p>
            </div>
          )}
          {messages.map((message, idx) => (
            <div key={`${message.id}-${idx}`} className="group">
              <div
                className={`flex gap-2.5 ${message.isCurrentUser ? "flex-row-reverse" : ""
                  }`}
              >
                <Avatar className="w-7 h-7 shrink-0 ring-1 ring-white/[0.08]">
                  <AvatarImage
                    src={`/avatar_thumbnail/${message.avatarId}.png`}
                    alt={message.userName}
                  />
                </Avatar>
                <div
                  className={`max-w-[75%] ${message.isCurrentUser ? "items-end" : "items-start"
                    } flex flex-col`}
                >
                  <div className="flex items-baseline gap-2 mb-0.5 px-0.5">
                    <span className="text-[11px] font-semibold text-white/50">
                      {message.isCurrentUser ? "You" : message.userName}
                    </span>
                    <span className="text-[10px] text-white/20">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-2 rounded-xl text-[13px] leading-relaxed ${message.isCurrentUser
                      ? "bg-[#6658fe]/20 text-white/90 rounded-tr-sm"
                      : "bg-white/[0.05] text-white/75 rounded-tl-sm"
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="shrink-0 p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-3 py-1 ring-1 ring-white/[0.06] focus-within:ring-[#6658fe]/30 transition-all">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-white/85 text-[13px] placeholder:text-white/20 py-2 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-1.5 rounded-lg text-[#6658fe] hover:bg-[#6658fe]/10 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PeoplePanel: React.FC = () => {
  const players = WebSocketSingleton.getPlayers();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-[11px] font-medium tracking-wider uppercase">
              Online
            </span>
            <span className="bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {players.length}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          {players.map((participant) => (
            <div
              key={participant.userId}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
            >
              <div className="relative">
                <Avatar className="w-9 h-9 ring-1 ring-white/[0.08]">
                  <AvatarImage
                    src={`/avatar_thumbnail/${participant.avatarId}-1.png`}
                    alt={participant.userName}
                  />
                </Avatar>
                <Circle
                  size={10}
                  className="absolute -bottom-0.5 -right-0.5 text-emerald-400 fill-emerald-400 stroke-[#0c0c14]"
                  strokeWidth={3}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white/80 font-medium truncate">
                  {participant.userName}
                </p>
                <p className="text-[11px] text-white/25">In space</p>
              </div>
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
              <Users size={20} className="text-white/20" />
            </div>
            <p className="text-white/25 text-sm">No one here yet</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

const DetailsPanel: React.FC<{ roomName: string; roomCode: string }> = ({
  roomName,
  roomCode,
}) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollArea className="h-full">
      <div className="px-4 py-3 space-y-5">
        <div>
          <div className="w-full h-28 rounded-2xl bg-gradient-to-br from-[#6658fe]/20 via-[#6658fe]/5 to-transparent flex items-center justify-center mb-4 ring-1 ring-white/[0.04]">
            <span className="text-3xl font-bold text-white/80 tracking-tight">
              {roomName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>

          <h2 className="text-lg font-semibold text-white/90 mb-1">
            {roomName}
          </h2>
          <p className="text-[13px] text-white/35">Virtual space</p>
        </div>

        <div className="h-px bg-white/[0.04]" />

        <div className="space-y-4">
          <div>
            <span className="text-[11px] font-medium text-white/30 tracking-wider uppercase block mb-2">
              Room Code
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06] flex-1">
                <Hash size={14} className="text-white/25" />
                <span className="text-[13px] text-white/70 font-mono tracking-wide">
                  {roomCode}
                </span>
              </div>
              <button
                onClick={copyCode}
                className="p-2.5 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-all"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-white/30 tracking-wider uppercase block mb-2">
              Participants
            </span>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
              <Users size={14} className="text-white/25" />
              <span className="text-[13px] text-white/70">
                {WebSocketSingleton.getPlayers().length} online
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/[0.04]" />

        <div>
          <span className="text-[11px] font-medium text-white/30 tracking-wider uppercase block mb-2">
            About
          </span>
          <p className="text-[13px] text-white/40 leading-relaxed">
            A collaborative virtual space for real-time communication and
            teamwork. Walk around, chat, and connect with others.
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SpaceSidebar;
export type { TabId };
