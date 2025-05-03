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

      const listingsRes = await axios.get('/listing/userId', {
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{username || email.split('@')[0]}</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            ✎
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm text-gray-700 font-medium">{t('profile.avatar')}</label>
            {isEditing ? (
              <div className="flex flex-col items-start">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mt-1 shadow-md">
              {avatarUrl ? (
                <img
                src={`http://localhost:3000${avatarUrl}`}
                alt="Avatar"
                className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                {t('profile.noAvatar')}
                </div>
              )}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">{t('profile.email')}</label>
            <p className="w-full px-4 py-2 border rounded-md bg-gray-100 mt-1">{email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">{t('profile.username')}</label>
            {isEditing ? (
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border rounded-md mt-1" />
            ) : (
              <p className="w-full px-4 py-2 border rounded-md bg-gray-100 mt-1">{username}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">{t('profile.phone')}</label>
            {isEditing ? (
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-md mt-1" />
            ) : (
              <p className="w-full px-4 py-2 border rounded-md bg-gray-100 mt-1">{phone}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">{t('profile.county')}</label>
            {isEditing ? (
                <select value={county} onChange={(e) => setCounty(e.target.value)} className="w-full px-4 py-2 border rounded-md mt-1">
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
              <p className="w-full px-4 py-2 border rounded-md bg-gray-100 mt-1">{county}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">{t('profile.city')}</label>
            {isEditing ? (
              <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2 border rounded-md mt-1" disabled={!county}>
                <option value="">{t('profile.city')}</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            ) : (
              <p className="w-full px-4 py-2 border rounded-md bg-gray-100 mt-1">{city}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">{t('profile.createdAt')}</label>
            <p className="w-full px-4 py-2 border rounded-md bg-gray-100 mt-1">{createdAt}</p>
          </div>
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mb-6"
          >
            {t('profile.save')}
          </button>
        )}

        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-700 transition mb-6"
          >
            {t('profile.cancel')}
          </button>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('profile.myListings')}</h3>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((item) => (
                <div key={item.id} className="border rounded-md p-4 bg-gray-50 shadow-sm">
                  <h4 className="font-bold text-gray-700">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <p className="text-xs text-gray-400">Publicat la: {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('profile.noListings')}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      </div>
    </div>
  );
}

export default Profile;