import { createContext, useContext, useState } from 'react';

interface ChatContextProps {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [roomId, setRoomId] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ roomId, setRoomId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};