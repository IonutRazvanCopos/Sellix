import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function EditListing() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [type, setType] = useState('SELL');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  type Category = {
    id: number | string;
    name: string;
    subcategories?: { id: number | string; name: string }[];
  };
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`/listings/${id}`);
        const listing = res.data;

        setTitle(listing.title);
        setDescription(listing.description);
        setPrice(listing.price.toString());
        setType(listing.type);
        setCurrency(listing.currency);
        
        const categoriesRes = await axios.get('/categories');
        setCategories(categoriesRes.data);

        const categoryIdString = listing.categoryId.toString();
        setCategoryId(categoryIdString);

        const subcatRes = await axios.get(`/categories/${categoryIdString}/subcategories`);
        const updatedCategories = [...categoriesRes.data];
        const catIndex = updatedCategories.findIndex(cat => cat.id.toString() === categoryIdString);

        if (catIndex !== -1) {
          updatedCategories[catIndex].subcategories = subcatRes.data;
          setCategories(updatedCategories);
        }

        setSubCategoryId(listing.subcategoryId?.toString() ?? '');

      } catch (err) {
        toast.error('Failed to load listing or categories');
        console.error(err);
      }
    };

    fetchData();
  }, [id, isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/listings/${id}`, {
        title,
        description,
        price,
        currency,
        type,
        categoryId,
        subcategoryId : subCategoryId,
      });

      toast.success('Listing updated!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update listing.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
      <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M12 8v4l3 3" />
      </svg>
      {t('listings.editListing')}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">{t('listings.title')}</label>
        <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('listings.title')}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">{t('listings.description')}</label>
        <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t('listings.description')}
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition resize-none"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
        <label className="block text-gray-700 font-semibold mb-1">{t('listings.Price')}</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={t('listings.Price')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          min="0"
          step="0.01"
        />
        </div>
        <div>
        <label className="block text-gray-700 font-semibold mb-1">{t('listings.currency')}</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="RON">RON</option>
          <option value="EUR">EUR</option>
        </select>
        </div>
        <div>
        <label className="block text-gray-700 font-semibold mb-1">{t('listings.type')}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="SELL">{t('listings.Sell')}</option>
          <option value="BID">{t('listings.Auction')}</option>
        </select>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
        <label className="block text-gray-700 font-semibold mb-1">{t('listings.categories')}</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition mb-4"
        >
          <option value="">{t('listings.categories')}</option>
          {categories.map((cat: any) => (
          <option key={cat.id} value={cat.id}>
            {t(`categories.${cat.name}`)}
          </option>
          ))}
        </select>
        <select
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          disabled={!categoryId}
        >
          <option value="">{t('listings.selectSubcategory')}</option>
          {categoryId &&
          categories
            .find((cat: any) => cat.id.toString() === categoryId)
            ?.subcategories?.map((sub: any) => (
            <option key={sub.id} value={sub.id}>
              {t(`subcategories.${sub.name}`)}
            </option>
            ))}
        </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition"
      >
        {t('listings.saveChanges')}
      </button>
      </form>
    </div>
  );
}

export default EditListing;