import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ListingList from '../../components/admin/ListingList';
import AddCategory from '../../components/admin/AddCategory';
import AddSubcategory from '../../components/admin/AddSubcategory';
import axios from '../../api/axios';

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
  const { currentUser } = useAuth();
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [hiddenListings, setHiddenListings] = useState<Listing[]>([]);

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  const fetchPending = async () => {
    try {
      const res = await axios.get('/admin/pending-listings');
      setPendingListings(res.data);
    } catch (error) {
      console.error('Error fetching pending listings:', error);
    }
  };

  const fetchHidden = async () => {
    try {
      const res = await axios.get('/admin/hidden-listings');
      setHiddenListings(res.data);
    } catch (error) {
      console.error('Error fetching hidden listings:', error);
    }
  };

  const approve = async (id: number) => {
    await axios.put(`/admin/approve-listing/${id}`);
    fetchPending();
  };

  const hide = async (id: number) => {
    await axios.put(`/admin/hide-listing/${id}`);
    fetchPending();
    fetchHidden();
  };

  const unhide = async (id: number) => {
    await axios.put(`/admin/unhide-listing/${id}`);
    fetchPending();
    fetchHidden();
  };

  useEffect(() => {
    fetchPending();
    fetchHidden();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">🔧 Admin Panel</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Pending Listings</h2>
        <ListingList listings={pendingListings} onApprove={approve} onHide={hide} type="pending" />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Hidden Listings</h2>
        <ListingList listings={hiddenListings} onUnhide={unhide} onHide={hide} type="hidden" />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <AddCategory token={''} />
        <AddSubcategory />
      </section>
    </div>
  );
}

export default AdminDashboard;