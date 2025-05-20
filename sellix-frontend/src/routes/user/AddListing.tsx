import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface Category {
  id: number;
  name: string;
}

function AddListing() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [type, setType] = useState('SELL');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }

    axios
      .get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error('Failed to fetch categories', err);
        toast.error('Could not load categories');
      });
  }, [isLoggedIn, navigate]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !description || !price || !categoryId) {
    toast.error('Please fill in all required fields.');
    return;
  }

  try {
    const formData = new FormData();
    const numericPrice = price.replace(/\./g, '');
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', numericPrice);
    formData.append('currency', currency);
    formData.append('type', type);
    formData.append('categoryId', categoryId);

    if (images) {
      Array.from(images).forEach((img) => {
        formData.append('images', img);
      });
    }

    await axios.post('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success('Listing created successfully!');
    navigate('/');
  } catch (error) {
    console.error(error);
    toast.error('Failed to create listing.');
  }
};

return (
  <div className="max-w-xl mx-auto mt-4 p-8 rounded-2xl shadow-xl bg-gradient-to-br from-white/80 via-white/60 to-white/80 backdrop-blur-md border border-gray-200">
    <div className="flex items-center gap-4 mb-8">
      <div className="bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-4 shadow-xl flex items-center justify-center animate-pulse">
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path fill="white" d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4h1V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v1h6V7a3 3 0 0 0-3-3Zm-5 5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H7Z"/>
      </svg>
      </div>
      <div>
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
        {t('listings.addListing')}
      </h1>
      <p className="text-gray-500 mt-1 text-sm">
        {t('listings.addListingSubtitle', 'Add a new product or service to your shop')}
      </p>
      </div>
    </div>
    <form onSubmit={handleSubmit} className="space-y-5">

      <input
        type="text"
        placeholder={t('listings.title')}
         className="w-full p-3 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder={t('listings.description')}
         className="w-full p-3 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div
        className="w-full border-2 border-dashed border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl p-8 flex flex-col items-center justify-center transition-shadow hover:shadow-xl cursor-pointer relative group"
        onClick={() => document.getElementById('imageUpload')?.click()}
      >
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full p-4 mb-2 shadow-lg group-hover:scale-110 transition-transform">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="12" fill="url(#paint0_linear)" />
              <path
                d="M7 17l3.5-4.5 2.5 3 3.5-4.5 4 6H3l4-6z"
                fill="white"
              />
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6"/>
                  <stop offset="0.5" stopColor="#A78BFA"/>
                  <stop offset="1" stopColor="#EC4899"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("listings.addImage")}
          </span>
          <span className="text-xs text-gray-400 mt-1">{t("listings.imageHint", "PNG, JPG, JPEG, max 5MB each")}</span>
        </div>
        <input
          id="imageUpload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => setImages(e.target.files)}
        />
        {images && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {Array.from(images).map((img, idx) => (
              <span
                key={idx}
                className="inline-block bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-700 text-xs px-3 py-1 rounded-full truncate max-w-[120px]"
                title={img.name}
              >
                {img.name.length > 15 ? img.name.slice(0, 12) + '...' : img.name}
              </span>
            ))}
          </div>
        )}
      </div>


      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9.]*"
          placeholder={t('listings.Price')}
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-gray-700 font-semibold shadow-sm transition"
          value={price}
          onChange={(e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        val = val.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        setPrice(val);
          }}
          required
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold pointer-events-none select-none">
          {currency}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="relative w-1/2">
          <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
          className="appearance-none w-full border border-gray-200 p-3 rounded-lg bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-gray-700 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
        <option value="RON">RON</option>
        <option value="EUR">EUR</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
          </div>
        </div>
        <div className="relative w-1/2">
          <select
        value={type}
        onChange={(e) => setType(e.target.value)}
          className="appearance-none w-full border border-gray-200 p-3 rounded-lg bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-gray-700 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          >
        <option value="SELL">{t('listings.Sell')}</option>
        <option value="BID">{t('listings.Auction')}</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
          </div>
        </div>
      </div>

      <div className="relative">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full appearance-none border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-gray-700 font-semibold pr-10"
          required
        >
          <option value="">{t("listings.categories")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {t(`categories.${cat.name}`)}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <button
        type="submit"
        className="w-full relative overflow-hidden py-3 rounded-xl font-bold text-lg shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <svg
        className="w-5 h-5 text-white opacity-80 group-hover:animate-bounce"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        viewBox="0 0 24 24"
          >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        />
          </svg>
          {t('listings.createListing')}
        </span>
        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
      </button>
    </form>
  </div>
);
}

export default AddListing;