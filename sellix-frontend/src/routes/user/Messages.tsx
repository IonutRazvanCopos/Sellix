import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ChatWindow from "../../components/Chat/ChatWindow";

interface Conversation {
  id: number;
  listing: {
    images: any;
    id: number;
    title: string;
  };
  participants: {
    avatar?: string | undefined; id: number; username: string | null; image?: string | null 
}[];
  messages: {
    senderId: number;
    content: string;
    timestamp: string;
  }[];
}

function Messages() {
  const { currentUser, isLoggedIn } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/messages/${currentUser.id}`);
        const data = await res.json();

        const sorted = data.sort((a: Conversation, b: Conversation) => {
          const lastMessageA = a.messages[a.messages.length - 1]?.timestamp || '';
          const lastMessageB = b.messages[b.messages.length - 1]?.timestamp || '';
          return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
        });

      setConversations(sorted);
    } catch (err) {
      console.error("Eroare la încărcarea conversațiilor:", err);
    }
  };


    fetchConversations();
  }, [isLoggedIn, currentUser?.id]);

  const handleConversationClick = (conv: Conversation) => {
    setActiveConversation(conv);
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 p-6 bg-gradient-to-tr from-blue-100 via-white to-purple-100 rounded-3xl shadow-2xl min-h-[80vh]">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-900 drop-shadow-lg tracking-tight">
        💬 Mesajele Mele
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            Conversații
          </h2>

          {conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 italic">Nu ai conversații încă.</p>
            </div>
          ) : (
            <ul className="space-y-3 overflow-y-auto max-h-[65vh] pr-2">
              {conversations.map((conv) => {
                const otherUser = conv.participants.find((p) => p.id !== currentUser.id);
                return (
                  <li
                    key={conv.id}
                    onClick={() => handleConversationClick(conv)}
                    className={`cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 border border-transparent
                      ${activeConversation?.id === conv.id
                        ? "bg-blue-100 border-blue-500 font-semibold"
                        : "hover:bg-blue-50"}`}
                  >
                    {otherUser?.avatar ? (
                      <img
                        src={`http://localhost:3000${otherUser.avatar}`}
                        alt={otherUser.username || "U"}
                        className="w-11 h-11 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <div className="bg-blue-300 text-white rounded-full w-11 h-11 flex items-center justify-center font-bold text-lg shadow-md">
                        {otherUser?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <div className="text-base font-medium text-blue-900">
                        {otherUser?.username || "Utilizator"}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {conv.listing?.title || "Anunț"}
                      </div>
                    </div>
                    {conv.listing?.images && conv.listing.images.length > 0 && conv.listing.images[0]?.url && (
                      <img
                      src={`http://localhost:3000${conv.listing.images[0].url}`}
                      alt="Anunț"
                      className="w-12 h-12 rounded-lg object-cover shadow-sm border auto ml-auto"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="relative flex flex-col bg-white rounded-2xl shadow-xl border border-blue-200 min-h-[65vh] max-h-[65vh] overflow-hidden">
          {activeConversation ? (
            <>
              <div className="flex items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <h2 className="text-lg font-bold text-blue-800">
                  {(() => {
                    const otherUser = activeConversation.participants.find((p) => p.id !== currentUser.id);
                    return (
                        <span className="flex items-center gap-2">
                        {otherUser?.avatar ? (
                          <img
                          src={`http://localhost:3000${otherUser.avatar}`}
                          alt={otherUser.username || "U"}
                          className="w-10 h-10 rounded-full object-cover shadow border border-black/60"
                          />
                        ) : (
                          <span className="bg-blue-300 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-base shadow">
                            {otherUser?.username?.[0]?.toUpperCase() || "U"}
                          </span>
                        )}
                        {otherUser?.username || "User"}
                      </span>
                    );
                  })()}
                </h2>
                <button
                  className="text-sm text-red-500 hover:underline px-2 py-1 rounded transition cursor-pointer"
                  onClick={() => setActiveConversation(null)}
                  title="Închide conversația"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatWindow
                  key={`${activeConversation.id}-${activeConversation.listing.id}`}
                  sellerId={activeConversation.participants.find((p) => p.id !== currentUser.id)?.id || 0}
                  listingId={activeConversation.listing.id}
                  onClose={() => setActiveConversation(null)}
                  initialMessages={activeConversation.messages}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-blue-300 p-6">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              <p className="mt-4 text-lg font-medium">Selectează o conversație pentru a începe chat-ul.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;