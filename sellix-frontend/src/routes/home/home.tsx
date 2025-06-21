import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useTranslation } from 'react-i18next';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: 'RON' | 'EUR';
  type: 'SELL' | 'BID';
  createdAt: string;
  user: {
    avatar: string;
    username: string; id: number 
};
  category?: { name: string };
  subcategory?: { name: string };
  images?: { url: string }[];
}

interface Category {
  id: number;
  name: string;
  subcategories?: { id: number; name: string }[];
}

function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeType, setActiveType] = useState<string>('ALL');
  const [showOthers, setShowOthers] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const { t } = useTranslation();
  const [showMoreSubcategories, setShowMoreSubcategories] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resListings = await axios.get('/listings');
        setListings(resListings.data);
        const resCategories = await axios.get('/categories');
        setCategories(resCategories.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const filteredListings = listings.filter(l =>
    (activeCategory === 'All' || l.category?.name === activeCategory) &&
    (activeSubcategory === null || l.subcategory?.name === activeSubcategory) &&
    (activeType === 'ALL' || l.type === activeType)
  );

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      {t("home.welcome")}
      </h1>

      {/* 🏷️ Categorii */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          className={`px-5 py-2 rounded-full font-semibold shadow-sm transition-colors duration-150 ${
        activeCategory === 'All'
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
          }`}
          onClick={() => {
            setActiveCategory('All');
            setActiveSubcategory(null);
          }}
        >
          {t('categories.All')}
        </button>
        {categories.slice(0, 6).map(cat => (
          <button
        key={cat.id}
        className={`px-5 py-2 rounded-full font-semibold shadow-sm transition-colors duration-150 ${
          activeCategory === cat.name
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
        }`}
        onClick={() => {
          setActiveCategory(cat.name);
          setActiveSubcategory(null);
        }}
          >
        {t(`categories.${cat.name}`, cat.name)}
          </button>
        ))}
        {categories.length > 6 && (
          <div className="relative">
        <button
          className={`px-5 py-2 rounded-full font-semibold shadow-sm flex items-center gap-1 transition-colors duration-150 ${
          categories.slice(6).some(cat => activeCategory === cat.name)
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
          }`}
          onClick={() => setShowOthers(prev => !prev)}
          type="button"
        >
          {t('categories.others', 'Others')}
          <svg
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
          showOthers ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showOthers && (
          <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-max py-2">
          {categories.slice(6).map(cat => (
          <button
          key={cat.id}
          className={`block w-full text-left px-5 py-2 rounded-xl font-semibold transition-colors duration-150 ${
            activeCategory === cat.name
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          : 'text-gray-700 hover:bg-blue-100'
          }`}
          onClick={() => {
            setActiveCategory(cat.name);
            setShowOthers(false);
          }}
          >
          {t(`categories.${cat.name}`, cat.name)}
          </button>
          ))}
          </div>
        )}
          </div>
        )}
      </div>

      {activeCategory !== 'All' && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveSubcategory(null)}
            className={`px-4 py-1 rounded-full font-semibold ${
              activeSubcategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
            }`}
          >
            {t("subcategories.All", "All")}
          </button>

          {categories
            .find(cat => cat.name === activeCategory)
            ?.subcategories?.slice(0, 6)
            .map(sub => (
              <button
                key={sub.id}
                className={`px-4 py-1 rounded-full font-semibold ${
                  activeSubcategory === sub.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
                }`}
                onClick={() => setActiveSubcategory(sub.name)}
              >
                {t(`subcategories.${sub.name}`, sub.name)}
              </button>
          ))}

          {showMoreSubcategories &&
            categories
              .find(cat => cat.name === activeCategory)
              ?.subcategories?.slice(6)
              .map(sub => (
                <button
                  key={sub.id}
                  className={`px-4 py-1 rounded-full font-semibold ${
                    activeSubcategory === sub.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
                  }`}
                  onClick={() => setActiveSubcategory(sub.name)}
                >
                  {t(`subcategories.${sub.name}`, sub.name)}
                </button>
          ))}

          {categories.find(cat => cat.name === activeCategory)?.subcategories?.length! > 6 && (
            <button
              onClick={() => setShowMoreSubcategories(prev => !prev)}
              className="px-3 py-1 rounded-full font-semibold bg-blue-200 hover:bg-blue-100 text-gray-700"
            >
              {showMoreSubcategories
              ? t("subcategories.showLess", "Show less")
              : t("subcategories.showMore", "Show more")}
            </button>
          )}
        </div>
      )}

      
      <div className="flex justify-center my-6">
      <hr className="w-1/3 border-t-2 border-gray-200" />
      </div>

      {/* 🔍 Filtrare */}
      <div className="flex justify-center gap-4 mb-8">
      <button
        className={`px-4 py-2 rounded-full ${activeType === 'ALL' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setActiveType('ALL')}
      >
        {t("listings.allTypes")}
      </button>
      <button
        className={`px-4 py-2 rounded-full ${activeType === 'SELL' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setActiveType('SELL')}
      >
        {t("listings.sell")}
      </button>
      <button
        className={`px-4 py-2 rounded-full ${activeType === 'BID' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setActiveType('BID')}
      >
        {t("listings.bid")}
      </button>
      </div>

      {/* 🗂️ Listings */}
      {filteredListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg">{t("listings.noListings")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map(listing => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl overflow-hidden hover:scale-[1.025] transition-transform duration-200 flex flex-col cursor-pointer"
            >
              <div className="relative">
                {listing.images?.length ? (
                  <img
                    src={`http://localhost:3000${listing.images[0].url}`}
                    alt={listing.title}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-48 md:h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">📦</div>
                )}
                <span className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {listing.price ? `${listing.price.toLocaleString('ro-RO')} ${listing.currency}` : t("listings.noPrice")}
                </span>
              </div>
              <div className="flex-1 flex flex-col p-4 sm:p-5">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-gray-900">{listing.title}</h2>
                <p className="text-gray-700 text-xs sm:text-sm line-clamp-2 mb-2">{listing.description}</p>
                <div className="flex items-center gap-1 mt-auto text-xs sm:text-sm text-gray-500">
                    {listing.user.avatar ? (
                      <img
                        src={`http://localhost:3000${listing.user.avatar}`}
                        alt={listing.user.username}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                      </svg>
                    )}
                  {t("listings.postedBy")}{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 m-0"
                    onClick={e => {
                      e.stopPropagation();
                      window.location.href = `/user/${listing.user.id}`;
                    }}
                  >
                    {listing.user.username}
                  </button>
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