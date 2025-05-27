import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";
import clsx from "clsx";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  createdAt: string;
  user: { username: string; id: number };
  images: { url: string }[];
  categories?: string;
}

function ListingDetails() {
  const { id } = useParams();
  const auth = useAuth();
  const user = auth.currentUser || auth.user || auth;
  const { t } = useTranslation();

  const [listing, setListing] = useState<Listing | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

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
        {user?.id === listing.user.id && (
        <Link
          to={`/edit-listing/${listing.id}`}
          className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition z-30"
          aria-label="Edit Listing"
        >
          <MdEdit className="text-2xl" />
        </Link>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{listing.title}</h1>
        <div className="flex items-center gap-3 mb-4">
          <FaUserCircle className="text-blue-400 text-2xl" />
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
            {listing.categories ? t(`categories.${listing.categories}`) : t("No category")}
          </span>
        </div>
        <p className="text-lg text-gray-700 mb-6 whitespace-pre-line">{listing.description}</p>
        </div>

        <div className="flex items-center gap-6 mt-6">
        <span className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {listing.price.toLocaleString('ro-RO')} {listing.currency}
        </span>
        {user?.id === listing.user.id && (
          <Link
          to={`/edit-listing/${listing.id}`}
          className={clsx(
            "flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition font-semibold"
          )}
          >
          <MdEdit /> {t("listings.editListing") || 'Edit Listing'}
          </Link>
        )}
        </div>
        {listing && user?.id === listing.user.id && (
        <div className="fixed bottom-4 left-0 w-full flex justify-center md:hidden z-40">
          <Link
          to={`/edit-listing/${listing.id}`}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition font-semibold"
          >
          <MdEdit /> {t("listings.editListing") || 'Edit Listing'}
          </Link>
        </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default ListingDetails;
