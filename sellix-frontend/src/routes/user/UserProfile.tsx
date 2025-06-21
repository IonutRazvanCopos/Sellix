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
      <div className="flex items-center gap-8 mb-10 bg-white rounded-2xl shadow-lg p-8">
        <div className="relative">
          <img
        src={user.avatar ? `http://localhost:3000${user.avatar}` : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.username) + '&background=0D8ABC&color=fff&size=128'}
        alt="User avatar"
        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-xl"
          />
          <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{user.username}</h1>
          <div className="flex items-center gap-2 text-gray-500">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-medium">
          {user.city && user.county
            ? `${user.city}, ${user.county}`
            : t("profile.noLocation") || "No available location"}
        </span>
          </div>
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