import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { useTranslation } from 'react-i18next';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  createdAt: string;
  images: { url: string }[];
}

interface UserProfileData {
  username: string;
  city: string;
  county: string;
  avatar?: string;
  listings: Listing[];
}

function UserProfile() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/users/${id}`)
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user profile:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (!user) return <div className="text-center py-10 text-red-500">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-6 mb-8">
      <img
        src={user.avatar ? `http://localhost:3000${user.avatar}` : 'https://via.placeholder.com/100'}
        alt="User avatar"
        className="w-24 h-24 rounded-full object-cover shadow-lg"
      />
      <div>
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-500">{user.city}, {user.county}</p>
      </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">{t("profile.listings") || "Listings"}</h2>
      {user.listings.length === 0 ? (
      <p className="text-gray-400">{t("listings.noListings")}</p>
      ) : (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {user.listings.map(listing => (
        <a
          key={listing.id}
          href={`/listing/${listing.id}`}
          className="border rounded-xl shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow block"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {listing.images?.[0] ? (
          <img
            src={`http://localhost:3000${listing.images[0].url}`}
            className="w-full h-40 object-cover"
            alt={listing.title}
          />
          ) : (
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center">📦</div>
          )}
          <div className="p-4">
          <h3 className="font-semibold">{listing.title}</h3>
          <p className="text-sm text-gray-500">{listing.description.slice(0, 60)}...</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(listing.createdAt).toLocaleDateString()}</p>
          <span className="text-sm font-bold text-blue-500 block mt-2">
            {listing.price} {listing.currency}
          </span>
          </div>
        </a>
        ))}
      </div>
      )}
    </div>
  );
}

export default UserProfile;