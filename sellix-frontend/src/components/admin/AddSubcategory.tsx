import { useEffect, useState } from 'react';
import axios from '../../api/axios';

interface Category {
  id: number;
  name: string;
}

const AddSubcategory = () => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const res = await axios.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    await axios.post('/admin/add-subcategory', {
      name,
      categoryId: Number(categoryId),
    });
    setName('');
    setCategoryId('');
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Add Subcategory</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Subcategory name"
        className="border p-2 rounded w-full mb-2"
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleAdd}
        className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600"
      >
        ➕ Add
      </button>
    </div>
  );
};

export default AddSubcategory;