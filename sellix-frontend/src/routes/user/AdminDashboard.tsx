import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ListingList from '../../components/listing/ListingList';
import AddCategory from '../../components/admin/AddCategory';
import AddSubcategory from '../../components/admin/AddSubcategory';
import { useAdminListings } from '../../hooks/useAdminListings';

function AdminDashboard() {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  const { pending, hidden, approve, hide, unhide } = useAdminListings();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">🔧 Admin Panel</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Pending Listings</h2>
        <ListingList listings={pending} onApprove={approve} onHide={hide} type="pending" />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Hidden Listings</h2>
        <ListingList listings={hidden} onUnhide={unhide} onHide={hide} type="hidden" />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <AddCategory token={''} />
        <AddSubcategory />
      </section>
    </div>
  );
}

export default AdminDashboard;