import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";

const socket = io("http://localhost:3000");

interface Message {
  senderId: number;
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  sellerId: number;
  listingId?: number;
  onClose: () => void;
  initialMessages: Message[];
}

function ChatWindow({ sellerId, listingId, initialMessages }: ChatWindowProps) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const endRef = useRef<HTMLDivElement>(null);

  const roomId = [currentUser.id, sellerId].sort((a, b) => a - b).join("_");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    const handleReceive = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [roomId]);

  const handleSend = async (content: string) => {

    socket.emit("chatMessage", {
      roomId,
      senderId: currentUser.id,
      receiverId: sellerId,
      content,
      listingId,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50 rounded-xl">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 italic mt-8">Nu ai mesaje încă.</div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={i}
              content={msg.content}
              senderId={msg.senderId}
              timestamp={msg.timestamp}
              isMe={msg.senderId === currentUser.id}
              senderLabel={msg.senderId === currentUser.id ? "Tu" : `User${msg.senderId}`}
            />
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-2 border-t border-blue-100 pt-2">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default ChatWindow;