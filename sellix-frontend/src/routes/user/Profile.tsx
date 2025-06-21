import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useTranslation } from 'react-i18next';
import { fetchCounties, fetchCities } from '../../services/locationService';
import { useAuth } from '../../context/AuthContext';

interface Listing {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

function Profile() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState('');
  const [countiesWithCities, setCountiesWithCities] = useState<Record<string, string[]>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingCounties, setIsLoadingCounties] = useState(true);
  const [page, setPage] = useState(0);

  async function fetchCountiesAndCities() {
    try {
      setIsLoadingCounties(true);
      const states = await fetchCounties();
      const formattedData: Record<string, string[]> = {};
      for (const state of states) {
        const cities = await fetchCities(state.iso2);
        formattedData[state.name.replace(' County', '')] = cities.map((c: any) => c.name);
      }
      setCountiesWithCities(formattedData);
      setIsLoadingCounties(false);
    } catch (error) {
      console.error('Error fetching counties and cities:', error);
    }
  }

  async function fetchProfile() {
    try {
      if (!token) return;

      const res = await axios.get('/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data.user;
      setEmail(user.email);
      setUsername(user.username || user.email.split('@')[0]);
      setPhone(user.phone || '');
      setCity(user.city || '');
      setCounty(user.county || '');
      setCreatedAt(new Date(user.createdAt).toLocaleDateString());
      setAvatarUrl(user.avatar || '');

      const listingsRes = await axios.get('/listings/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(listingsRes.data);
    } catch {
      setError(t('profile.error'));
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetchProfile();
      await fetchCountiesAndCities();
    }

    fetchData();
  }, [t, isEditing, token]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  }

  async function handleSave() {
    try {
      if (!token) return;

      const formData = new FormData();
      formData.append('username', username);
      formData.append('phone', phone);
      formData.append('city', city);
      formData.append('county', county);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      await axios.put('/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsEditing(false);
    } catch {
      setError(t('profile.error'));
    }
  }

  const availableCities = countiesWithCities[county] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-30 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-br from-pink-400 via-yellow-400 to-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
        <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 mb-4">
          {isEditing ? (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            />
            <span className="text-blue-700 font-semibold">{t('profile.avatar')}</span>
            <span className="text-xs text-gray-500 mt-1">{t('Upload')}</span>
          </label>
          ) : avatarUrl ? (
          <img
            src={`http://localhost:3000${avatarUrl}`}
            alt="Avatar"
            className="object-cover w-full h-full"
          />
          ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-bold">
            <span>{username ? username[0].toUpperCase() : "?"}</span>
          </div>
          )}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-full shadow-lg font-semibold transition-all duration-200"
        >
          {isEditing ? t('profile.cancel') : t('profile.edit')}
        </button>
        </div>
        <div className="flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t('profile.email')}</label>
          <p className="w-full px-4 py-2 border rounded-lg bg-gray-100 mt-1 font-mono text-gray-700">{email}</p>
          </div>
          <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t('profile.username')}</label>
          {isEditing ? (
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="w-full px-4 py-2 border rounded-lg bg-gray-100 mt-1">{username}</p>
          )}
          </div>
          <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t('profile.phone')}</label>
          {isEditing ? (
            <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="w-full px-4 py-2 border rounded-lg bg-gray-100 mt-1">{phone}</p>
          )}
          </div>
          <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t('profile.county')}</label>
          {isEditing ? (
            <select
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
            >
            <option value="">{t('profile.county')}</option>
            {isLoadingCounties ? (
              <option value="" disabled>{t('loading')}...</option>
            ) : (
              Object.keys(countiesWithCities).map((county) => (
              <option key={county} value={county}>{county}</option>
              ))
            )}
            </select>
          ) : (
            <p className="w-full px-4 py-2 border rounded-lg bg-gray-100 mt-1">{county}</p>
          )}
          </div>
          <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t('profile.city')}</label>
          {isEditing ? (
            <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
            disabled={!county}
            >
            <option value="">{t('profile.city')}</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
            </select>
          ) : (
            <p className="w-full px-4 py-2 border rounded-lg bg-gray-100 mt-1">{city}</p>
          )}
          </div>
          <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t('profile.createdAt')}</label>
          <p className="w-full px-4 py-2 border rounded-lg bg-gray-100 mt-1">{createdAt}</p>
          </div>
        </div>
        {isEditing && (
          <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-full font-bold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            {t('profile.save')}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-full font-bold shadow hover:bg-gray-400 transition-all"
          >
            {t('profile.cancel')}
          </button>
          </div>
        )}
        </div>
      </div>

      <div className="relative z-10 mb-8">
        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6">
          {t('profile.myListings')}
        </h3>
        {listings.length > 0 ? (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings
        .slice(page * 4, page * 4 + 4)
        .map((item) => (
          <div
        key={item.id}
        className="border-2 border-transparent hover:border-blue-400 transition-all rounded-2xl p-6 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-lg hover:scale-105 duration-200"
          >
        <h4 className="font-bold text-lg text-blue-800 mb-2">{item.title}</h4>
        <p className="text-gray-700 mb-3">{item.description}</p>
        <p className="text-xs text-gray-500">
          {t('listings.publishedAt')}: {new Date(item.createdAt).toLocaleDateString()}
        </p>
          </div>
        ))}
        </div>
        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="flex justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`px-4 py-2 rounded-full font-semibold shadow ${page === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {t('previous')}
        </button>
        <button
          onClick={() => setPage((p) => (p + 1 < Math.ceil(listings.length / 4) ? p + 1 : p))}
          disabled={page + 1 >= Math.ceil(listings.length / 4)}
          className={`px-4 py-2 rounded-full font-semibold shadow ${page + 1 >= Math.ceil(listings.length / 4) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {t('next')}
        </button>
          </div>
          <span className="text-sm text-gray-600 mt-1">
        {t('profile.page')}: {page + 1} / {Math.max(1, Math.ceil(listings.length / 4))}
          </span>
        </div>
          </>
        ) : (
          <p className="text-gray-500">{t('profile.noListings')}</p>
        )}
      </div>

      {error && (
        <div className="relative z-10">
        <p className="text-red-600 text-center text-sm font-semibold mb-2">{error}</p>
        </div>
      )}
      </div>
    </div>
  );
}

export default Profile;