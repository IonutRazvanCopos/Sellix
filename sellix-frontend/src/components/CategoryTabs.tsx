import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

export default function CategoryTabs() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error loading categories', err));
  }, []);

  const displayed = showAll ? categories : categories.slice(0, 6);

  return (
    <div className="flex flex-wrap justify-center gap-2 px-4 py-4">
      {displayed.map(cat => (
        <button
          key={cat.id}
          onClick={() => navigate(`/category/${cat.id}`)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:scale-105 transition shadow"
        >
          {cat.name}
        </button>
      ))}
      {categories.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1 text-sm text-blue-500 underline"
        >
          {showAll ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
