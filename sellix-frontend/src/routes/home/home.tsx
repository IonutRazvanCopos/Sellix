import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Listing {
  price: any;
  currency: 'RON' | 'EUR';
  id: number;
  title: string;
  description: string;
  createdAt: string;
  user: {
    username: string;
    id: number;
  };
  images?: {
    url: string;
  }[];
}

function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('/listings');
        setListings(res.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      {t("home.welcome")}
      </h1>

      {listings.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-64">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 text-lg">{t("listings.noListings") || "No listings available."}</p>
      </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <Link
        key={listing.id}
        to={`/listing/${listing.id}`}
        className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl overflow-hidden hover:scale-[1.025] transition-transform duration-200 flex flex-col cursor-pointer"
          >
        <div className="relative">
          {listing.images && listing.images.length > 0 ? (
            <img
          src={`http://localhost:3000${listing.images[0].url}`}
          alt={listing.title}
          className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-400 text-4xl">
          <span>📦</span>
            </div>
          )}
          <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {listing.price
          ? `${Number(listing.price).toLocaleString('ro-RO')} ${listing.currency === 'RON' ? 'RON' : '€'}`
          : t("listings.noPrice")}
          </span>
        </div>
        <div className="flex-1 flex flex-col p-5">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">{listing.title}</h2>
          <p className="text-gray-700 text-base mb-4 line-clamp-3">{listing.description}</p>
          <div className="flex items-center gap-2 mt-auto text-sm text-gray-500">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
            </svg>
            {t("listings.postedBy")}{' '}
            {listing.user?.username ? (
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/user/${listing.user.id}`);
                  }}
                >
                  {listing.user.username}
                </span>
            ) : (
              'Anonymous'
            )}
            <span className="mx-2">•</span>
            <span className="text-xs">{new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}

export default Home;