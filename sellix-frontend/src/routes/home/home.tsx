import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useTranslation } from 'react-i18next';

interface Listing {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  user: {
    username: string | null;
  };
  images?: {
    url: string;
  }[];
}

function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const { t } = useTranslation();

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
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("home.welcome")}</h1>

      {listings.length === 0 ? (
        <p className="text-gray-600 text-center">No listings available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white p-4 shadow-md rounded-lg">

              {listing.images && listing.images.length > 0 && (
                <img
                  src={`http://localhost:3000${listing.images[0].url}`}
                  alt="Listing"
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}

              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <p className="text-gray-700 text-sm mt-2 line-clamp-3">{listing.description}</p>

              <div className="mt-4 text-sm text-gray-500">
                {t("listings.postedBy")} {listing.user?.username || 'Anonymous'}
              </div>

              <Link
                to={`/listing/${listing.id}`}
                className="inline-block mt-4 text-blue-600 hover:underline text-sm"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;