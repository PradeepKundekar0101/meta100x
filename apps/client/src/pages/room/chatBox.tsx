import React, { useEffect, useState, useRef } from 'react'
import { Send } from "lucide-react"
import { useAppSelector } from '@/store/hooks'
import { toast } from 'sonner'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {WebSocketSingleton} from '@/utils/websocket'

interface ChatBoxProps {
  isChatOpen: boolean
}

interface Message {
  id: string
  content: string
  userName: string
  createdAt: string
  avatarId: string
  isCurrentUser: boolean
}

const ChatBox: React.FC<ChatBoxProps> = ({ isChatOpen }) => {
  const { user, token } = useAppSelector((state) => state.auth)
  const socketUrl = import.meta.env.VITE_WS_URL
  const socket = WebSocketSingleton.getInstance(socketUrl)

  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "CHAT_MESSAGE_CLIENT",
          payload: {
            token,
            content: inputMessage,
            userName: user?.userName,
            avatarId: localStorage.getItem("avatarId") || "pajji"
          }
        }))
      }
      setInputMessage("")
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = JSON.parse(event.data)
      
      if (type === "ERROR") {
        toast(payload.message || "Error from server")
      }
      
      if (type === "CHAT_MESSAGE_SERVER") {
        const { avatarId, userName, createdAt, content, userId } = payload
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: String(Date.now()),
            content,
            userName: userId === user?.id ? "You" : userName,
            createdAt,
            avatarId,
            isCurrentUser: userId === user?.id
          }
        ])
      }
    }

    socket.addEventListener("message", handleMessage)

    return () => {
      socket.removeEventListener("message", handleMessage)
    }
  }, [socket, user])

  return (
    <div
      className={`fixed chat top-0 h-screen w-80 bg-black bg-opacity-20 transition-transform duration-300 ${
        isChatOpen ? "translate-x-0" : "translate-x-full"
      } right-0 z-100`}
    >
      <div className="flex-grow overflow-y-auto p-4 space-y-4 h-[calc(100%-100px)]">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-start space-x-2 ${
              message.isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <Avatar className="w-8 h-8 bg-blue-600">
              <AvatarImage 
                src={`../../public/avatar_thumbnail/${message.avatarId}.png`} 
                alt={message.userName} 
              />
            </Avatar>
            <div 
              className={`p-2 rounded-lg max-w-[70%] ${
                message.isCurrentUser 
                  ? 'bg-blue-600 text-white self-end' 
                  : 'bg-gray-200 text-black self-start'
              }`}
            >
              <p className="text-sm font-semibold mb-1">{message.userName}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 absolute bottom-0 border-t border-gray-700 flex items-center justify-end">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-grow bg-[#0009] text-white p-2 rounded-l-lg focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatBox