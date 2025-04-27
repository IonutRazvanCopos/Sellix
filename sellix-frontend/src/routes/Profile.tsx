import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useTranslation } from 'react-i18next';

interface Listing {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

const countiesWithCities: Record<string, string[]> = {
  "Alba": ["Alba Iulia", "Blaj", "Aiud"],
  "Arad": ["Arad", "Ineu", "Lipova"],
  "Arges": ["Pitesti", "Campulung", "Mioveni"],
  "Bacau": ["Bacau", "Onesti", "Moinesti"],
  "Bihor": ["Oradea", "Salonta", "Beius"],
  "Bistrita-Nasaud": ["Bistrita", "Nasaud", "Beclean"],
  "Botosani": ["Botosani", "Dorohoi"],
  "Braila": ["Braila"],
  "Brasov": ["Brasov", "Sacele", "Fagaras"],
  "Bucuresti": ["Bucuresti"],
  "Buzau": ["Buzau", "Ramnicu Sarat"],
  "Caras-Severin": ["Resita", "Caransebes"],
  "Calarasi": ["Calarasi", "Oltenita"],
  "Cluj": ["Cluj-Napoca", "Turda", "Dej", "Gherla"],
  "Constanta": ["Constanta", "Medgidia", "Mangalia"],
  "Covasna": ["Sfantu Gheorghe", "Targu Secuiesc"],
  "Dambovita": ["Targoviste", "Moreni"],
  "Dolj": ["Craiova", "Calafat"],
  "Galati": ["Galati", "Tecuci"],
  "Giurgiu": ["Giurgiu"],
  "Gorj": ["Targu Jiu", "Motru"],
  "Harghita": ["Miercurea Ciuc", "Gheorgheni"],
  "Hunedoara": ["Deva", "Hunedoara", "Petrosani"],
  "Ialomita": ["Slobozia", "Fetesti"],
  "Iasi": ["Iasi", "Pascani"],
  "Ilfov": ["Buftea", "Voluntari"],
  "Maramures": ["Baia Mare", "Sighetu Marmatiei"],
  "Mehedinti": ["Drobeta-Turnu Severin"],
  "Mures": ["Targu Mures", "Reghin", "Sighisoara"],
  "Neamt": ["Piatra Neamt", "Roman"],
  "Olt": ["Slatina", "Caracal"],
  "Prahova": ["Ploiesti", "Campina"],
  "Salaj": ["Zalau", "Simleu Silvaniei", "Jibou"],
  "Satu Mare": ["Satu Mare", "Carei"],
  "Sibiu": ["Sibiu", "Medias"],
  "Suceava": ["Suceava", "Falticeni", "Radauti"],
  "Teleorman": ["Alexandria", "Rosiorii de Vede"],
  "Timis": ["Timisoara", "Lugoj"],
  "Tulcea": ["Tulcea"],
  "Valcea": ["Ramnicu Valcea", "Dragasani"],
  "Vaslui": ["Vaslui", "Barlad"],
  "Vrancea": ["Focsani", "Adjud"]
};

function Profile() {
  const { t } = useTranslation();
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('/profile', {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        const user = res.data.user;
        setEmail(user.email);
        setUsername(user.username || user.email.split('@')[0]);
        setPhone(user.phone || '');
        setCity(user.city || '');
        setCounty(user.county || '');
        setCreatedAt(new Date(user.createdAt).toLocaleDateString());
        setAvatarUrl(user.avatar || '');

        const listingsRes = await axios.get('/my-listings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(listingsRes.data);
      } catch {
        setError(t('profile.error'));
      }
    }

    fetchProfile();
  }, [t, isEditing]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  }

  async function handleSave() {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('username', username);
      formData.append('phone', phone);
      formData.append('city', city);
      formData.append('county', county);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      await axios.put('/update-profile', formData, {
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
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="w-full mt-1" />
            ) : (
              <div className="w-24 h-24 rounded-full overflow-hidden border mt-1">
                {avatarUrl ? (
                  <img
                    src={`http://localhost:3000${avatarUrl}`}
                    alt="Avatar"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Avatar</div>
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
                {Object.keys(countiesWithCities).map((judet) => (
                  <option key={judet} value={judet}>{judet}</option>
                ))}
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
                {availableCities.map((oras) => (
                  <option key={oras} value={oras}>{oras}</option>
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