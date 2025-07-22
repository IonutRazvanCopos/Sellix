import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  images: { url: string }[];
  user: { username: string };
  category: { name: string };
  subcategory?: { name: string };
}

function AdminDashboard() {
  const { currentUser, token } = useAuth();
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({ name: '', categoryId: '' });

  if (currentUser?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  const fetchPending = async () => {
    const res = await fetch('http://localhost:3000/api/admin/pending-listings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setPendingListings(data);
  };

  const approve = async (id: number) => {
    await fetch(`http://localhost:3000/api/admin/approve-listing/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPending();
  };

  const hide = async (id: number) => {
    await fetch(`http://localhost:3000/api/admin/hide-listing/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPending();
  };

  const addCategory = async () => {
    await fetch(`http://localhost:3000/api/admin/add-category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: newCategory })
    });
    setNewCategory('');
  };

  const addSubcategory = async () => {
    await fetch(`http://localhost:3000/api/admin/add-subcategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newSubcategory.name,
        categoryId: Number(newSubcategory.categoryId)
      })
    });
    setNewSubcategory({ name: '', categoryId: '' });
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">🔧 Admin Panel</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Pending Listings</h2>
        <ul className="space-y-4">
          {pendingListings.map((listing) => (
            <li key={listing.id} className="border p-4 rounded-lg bg-white shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                {listing.images[0] && (
                  <img src={`http://localhost:3000${listing.images[0].url}`} alt="" className="w-20 h-20 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-bold text-lg">{listing.title}</h3>
                  <p className="text-sm text-gray-600">by {listing.user.username}</p>
                  <p className="text-sm text-gray-500">
                    {listing.category.name} / {listing.subcategory?.name || 'No subcategory'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approve(listing.id)} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                  ✅ Approve
                </button>
                <button onClick={() => hide(listing.id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                  🗑️ Hide
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Add Category</h2>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="border p-2 rounded w-full mb-2"
          />
          <button onClick={addCategory} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
            ➕ Add
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Add Subcategory</h2>
          <input
            type="text"
            value={newSubcategory.name}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
            placeholder="Subcategory name"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            value={newSubcategory.categoryId}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
            placeholder="Category ID"
            className="border p-2 rounded w-full mb-2"
          />
          <button onClick={addSubcategory} className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600">
            ➕ Add
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;