import { FC, useState } from 'react';
import { Listing } from '../../types';

interface Props {
  listings: Listing[];
  onApprove?: (id: number) => void;
  onHide?: (id: number) => void;
  onUnhide?: (id: number) => void;
  showActions?: boolean;
  type?: 'pending' | 'hidden';
}

const ListingList: FC<Props> = ({ listings, onApprove, onHide, onUnhide, type = 'pending' }) => {
  const [selected, setSelected] = useState<Listing | null>(null);

  return (
    <>
    {selected && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4">{selected.title}</h2>
          <p className="mb-2 text-gray-700">{selected.description}</p>
          <p className="text-sm text-gray-500">Category: {selected.category.name}</p>
          <p className="text-sm text-gray-500">Subcategory: {selected.subcategory?.name}</p>
          <div className="flex gap-2 my-4 flex-wrap">
            {selected.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:3000${img.url}`}
                alt=""
                className="w-32 h-32 object-cover rounded cursor-pointer hover:scale-105 transition"
                onClick={() => window.open(`http://localhost:3000${img.url}`, '_blank')}
                title="Click to open"
              />
            ))}
          </div>
          <button
            onClick={() => setSelected(null)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    )}

    <ul className="space-y-4">
      {listings.map((listing) => (
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
            {type === 'pending' && onApprove && (
              <button onClick={() => onApprove(listing.id)} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                ✅ Approve
              </button>
            )}
            {(type === 'pending') && onHide && (
              <button onClick={() => onHide(listing.id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                🗑️ Hide
              </button>
            )}
            {type === 'hidden' && onUnhide && (
              <button onClick={() => onUnhide(listing.id)} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                👁️ Unhide
              </button>
            )}
            <button onClick={() => setSelected(listing)} className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400">
              👁️ View
            </button>
          </div>
        </li>
      ))}
    </ul>
    </>
  );
};

export default ListingList;