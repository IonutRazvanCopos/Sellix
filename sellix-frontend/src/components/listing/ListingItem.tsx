import { Listing } from '../../types';

type ListingType = 'pending' | 'hidden';

export default function ListingItem({
  listing,
  type,
  onApprove,
  onHide,
  onUnhide,
  onView,
}: {
  listing: Listing;
  type: ListingType;
  onApprove?: (id: number) => void;
  onHide?: (id: number) => void;
  onUnhide?: (id: number) => void;
  onView?: (l: Listing) => void;
}) {
  return (
    <li className="border p-4 rounded-lg bg-white shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex gap-4 items-center">
        {listing.images?.[0] && (
          <img
            src={`http://localhost:3000${listing.images[0].url}`}
            alt=""
            className="w-20 h-20 object-cover rounded"
          />
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
          <button
            onClick={() => onApprove(listing.id)}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            ✅ Approve
          </button>
        )}

        {type === 'pending' && onHide && (
          <button
            onClick={() => onHide(listing.id)}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            🗑️ Hide
          </button>
        )}

        {type === 'hidden' && onUnhide && (
          <button
            onClick={() => onUnhide(listing.id)}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            👁️ Unhide
          </button>
        )}

        <button
          onClick={() => onView ? onView(listing) : window.open(`http://localhost:3000${listing.images?.[0]?.url ?? ''}`, '_blank')}
          className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
        >
          👁️ View
        </button>
      </div>
    </li>
  );
}