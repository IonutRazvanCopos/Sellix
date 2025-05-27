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
  const [categories, setCategories] = useState([]);

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
        setCurrency(listing.currency);
        setType(listing.type);
        setCategoryId(listing.categoryId.toString());
      } catch (err) {
        toast.error('Failed to load listing');
      }

      try {
        const res = await axios.get('/categories');
        setCategories(res.data);
      } catch {
        toast.error('Could not load categories');
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
      });

      toast.success('Listing updated!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update listing.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">{t('listings.editListing')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('listings.title')}
          className="w-full p-3 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('listings.description')}
          className="w-full p-3 border rounded"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={t('listings.Price')}
          className="w-full p-3 border rounded"
        />
        <div className="flex gap-4">
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-3 border rounded">
            <option value="RON">RON</option>
            <option value="EUR">EUR</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 border rounded">
            <option value="SELL">{t('listings.Sell')}</option>
            <option value="BID">{t('listings.Auction')}</option>
          </select>
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="">{t('listings.categories')}</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {t(`categories.${cat.name}`)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          {t('listings.saveChanges')}
        </button>
      </form>
    </div>
  );
}

export default EditListing;