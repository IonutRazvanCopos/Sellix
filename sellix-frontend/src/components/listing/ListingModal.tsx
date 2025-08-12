import { Listing } from '../../types';

export default function ListingModal({
  listing,
  onClose,
}: {
  listing: Listing | null;
  onClose: () => void;
}) {
  if (!listing) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{listing.title}</h2>
            <p className="text-gray-700 mb-3">{listing.description}</p>
            <p className="text-sm text-gray-500">
              Category: {listing.category.name}
            </p>
            <p className="text-sm text-gray-500">
              Subcategory: {listing.subcategory?.name || 'No subcategory'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            title="Close"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {listing.images?.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:3000${img.url}`}
              alt=""
              className="w-36 h-36 object-cover rounded cursor-pointer hover:scale-105 transition"
              onClick={() => window.open(`http://localhost:3000${img.url}`, '_blank')}
              title="Click to open"
            />
          ))}
        </div>
      </div>
    </div>
  );
}