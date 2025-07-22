import { useState } from "react";

interface MessageInputProps {
  onSend: (message: string) => Promise<void> | void;
}

function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    try {
      setIsSending(true);
      await onSend(trimmed);
      setMessage("");
    } catch (error) {
      console.error("Eroare la trimiterea mesajului:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 px-4 py-3 border-t border-blue-200 bg-gradient-to-r from-[#4e9fff]/10 to-[#ff4ecd]/10 rounded-b-3xl">
      <input
        type="text"
        placeholder="Scrie un mesaj..."
        className="flex-1 border border-[#4e9fff]/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4e9fff] transition bg-white/90 shadow-inner text-[#4e9fff] placeholder:text-[#4e9fff]/60 font-medium"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending}
      />
      <button
        onClick={handleSubmit}
        disabled={isSending}
        className={`px-6 py-2 rounded-xl font-bold shadow-lg transition active:scale-95 cursor-pointer ${
          isSending
            ? "bg-gray-300 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-[#4e9fff] to-[#ff4ecd] text-white hover:from-[#3a7fd5] hover:to-[#d946ef]"
        }`}
      >
        {isSending ? "..." : "Trimite"}
      </button>
    </div>
  );
}

export default MessageInput;