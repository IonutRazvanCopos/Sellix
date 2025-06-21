import React from "react";

interface MessageBubbleProps {
  senderId: number;
  content: string;
  timestamp: string;
  isMe: boolean;
  username?: string | null;
  senderLabel: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, timestamp, isMe, username }) => {
  const formattedTime = new Date(timestamp).toLocaleString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[75%] px-4 py-2 rounded-2xl text-base shadow-md mb-2
          ${
            isMe
              ? "bg-gradient-to-l from-[#4e9fff] to-[#ff4ecd] text-white rounded-br-sm"
              : "bg-gradient-to-r from-[#328400] to-[#00ae8e] text-white rounded-bl-sm"
          }
        `}
      >
        {!isMe && username && (
          <div className="font-bold text-[#4e9fff] mb-1">{username}</div>
        )}
        <div>{content}</div>
        <div className="text-xs text-gray-300 mt-1 text-right">{formattedTime}</div>
      </div>
    </div>
  );
};

export default MessageBubble;