import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";
import clsx from "clsx";
import ChatWindow from '../../components/chat/ChatWindow';

interface Listing {
  category: any;
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  createdAt: string;
  user: { username: string; id: number, avatar?: string };
  images: { url: string }[];
  categories?: string;
}

function ListingDetails() {
  const { id } = useParams();
  const auth = useAuth();
  const userId = auth.currentUser?.id;
  const { t } = useTranslation();

  const [listing, setListing] = useState<Listing | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error('Error loading listing:', err);
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="animate-spin text-3xl text-blue-500 mb-2">⏳</span>
        <p className="text-center text-gray-500">{t("Loading...") || 'Loading listing...'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-2xl mt-8 relative">
      <Link
      to={-1 as any}
      className="absolute left-2 top-2 md:-top-8 md:-left-8 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-full px-4 py-2 md:px-5 md:py-2.5 hover:from-purple-600 hover:to-blue-500 transition-all duration-200 border-4 border-white z-20 ring-2 ring-blue-200"
      style={{ textDecoration: "none" }}
      >
      <FiArrowLeft className="text-2xl drop-shadow" />
      </Link>

      {modalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
        onClick={() => setModalOpen(false)}
      >
        <div
        className="relative bg-transparent"
        onClick={e => e.stopPropagation()}
        >
        <img
          src={`http://localhost:3000${listing.images[modalIndex].url}`}
          alt="Preview"
          className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl"
        />
        {listing.images.length > 1 && (
          <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
            onClick={() => setModalIndex((modalIndex - 1 + listing.images.length) % listing.images.length)}
            aria-label="Previous image"
          >
            &#8592;
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
            onClick={() => setModalIndex((modalIndex + 1) % listing.images.length)}
            aria-label="Next image"
          >
            &#8594;
          </button>
          </>
        )}
        <button
          className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
          onClick={() => setModalOpen(false)}
          aria-label="Close"
        >
          ✕
        </button>
        </div>
      </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 flex flex-col gap-4 relative">
        {listing.images && listing.images.length > 0 ? (
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
          <img
          src={`http://localhost:3000${listing.images[modalIndex].url}`}
          alt="Listing"
          className="object-cover w-full h-72 md:h-96 transition-transform duration-300 hover:scale-105 cursor-pointer"
          onClick={() => setModalOpen(true)}
          />
          {listing.images.length > 1 && (
          <>
            <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
            onClick={e => {
              e.stopPropagation();
              setModalIndex((modalIndex - 1 + listing.images.length) % listing.images.length);
            }}
            aria-label="Previous image"
            >
            &#8592;
            </button>
            <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
            onClick={e => {
              e.stopPropagation();
              setModalIndex((modalIndex + 1) % listing.images.length);
            }}
            aria-label="Next image"
            >
            &#8594;
            </button>
          </>
          )}
        </div>
        ) : (
        <div className="flex items-center justify-center h-72 bg-gray-100 rounded-xl text-gray-400 text-5xl">
          <FaUserCircle />
        </div>
        )}
        {listing.images && listing.images.length > 1 && (
        <div className="flex gap-2 mt-2">
          {listing.images.slice(0, 5).map((img, idx) => (
          <img
            key={idx}
            src={`http://localhost:3000${img.url}`}
            alt="Thumbnail"
            className={clsx(
            "object-cover w-20 h-20 rounded-lg border border-gray-200 hover:scale-105 transition cursor-pointer",
            modalIndex === idx && !modalOpen && "ring-2 ring-blue-500"
            )}
            onClick={() => {
            setModalOpen(false);
            setModalIndex(idx);
            }}
          />
          ))}
        </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{listing.title}</h1>
        <div className="flex items-center gap-3 mb-4 mt-4">
            <Link to={`/user/${listing.user.id}`}>
            {listing.user.avatar ? (
              <img
              src={`http://localhost:3000${listing.user.avatar}`}
              alt={listing.user.username}
              className="w-8 h-8 rounded-full object-cover border border-blue-200 cursor-pointer"
              />
            ) : (
              <FaUserCircle className="text-blue-400 text-2xl cursor-pointer" />
            )}
            </Link>
          <Link
            to={`/user/${listing.user.id}`}
            className="font-medium text-gray-700 hover:underline hover:text-blue-600 transition"
          >
            {listing.user.username}
          </Link>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500 text-sm">
            {new Date(listing.createdAt).toLocaleDateString()}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-blue-600 font-semibold text-sm">
            {listing.category?.name ? t(`categories.${listing.category.name}`) : t("No category")}
          </span>
        </div>
        <p className="text-lg text-gray-700 mb-6 whitespace-pre-line">{listing.description}</p>
        </div>

        <div className="flex items-center gap-6 mt-6">
        <span className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {listing.price.toLocaleString('ro-RO')} {listing.currency}
        </span>
        {userId === listing.user.id && (
          <Link
          to={`/edit-listing/${listing.id}`}
          className={clsx(
            "flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition font-semibold"
          )}
          >
          <MdEdit /> {t("listings.editListing")}
          </Link>
        )}
        {auth.isLoggedIn && userId !== listing.user.id && (
            <div>
            {/* Floating chat bubble button */}
            {!showChat && (
              <button
          type="button"
          className="fixed z-40 bottom-13 right-8 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition font-semibold"
          onClick={() => setShowChat(true)}
          style={{ boxShadow: "0 4px 24px rgba(80, 80, 200, 0.15)" }}
              >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="hidden md:inline">{t("Chat with seller")}</span>
              </button>
            )}
            {typeof window !== "undefined" && showChat && (
              <div className="fixed z-50 bottom-24 right-8 max-w-sm w-full">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <button
              className="absolute top-2 right-2 z-10 bg-transparent rounded-full p-1 transition cursor-pointer"
              onClick={() => setShowChat(false)}
              aria-label="Close chat"
            >
              <span className="text-white text-xl">✕</span>
            </button>
            <div className="flex flex-col h-[420px] w-full">
              <div className="flex items-center gap-2 px-4 py-3 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg rounded-t-2xl shadow-sm">
                <FaUserCircle className="text-2xl" />
                <span>{listing.user.username}</span>
              </div>
              <div className="flex-1 overflow-y-auto px-1 bg-gray-50 custom-scrollbar"
                style={{ scrollbarWidth: "thin", maxHeight: 370 }}>
                <ChatWindow
                  sellerId={listing.user.id}
                  listingId={listing.id}
                  onClose={() => setShowChat(false)}
                  initialMessages={[]}
                />
              </div>
            </div>
          </div>
              </div>
            )}
            <style>
              {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            background: #e5e7eb;
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #a5b4fc;
            border-radius: 8px;
          }
              `}
            </style>
            </div>
        )}
        {!auth.isLoggedIn && (
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition font-semibold"
            onClick={() => window.location.href = '/login'}
          >
            {t("Chat with seller")}
          </button>
        )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default ListingDetails;