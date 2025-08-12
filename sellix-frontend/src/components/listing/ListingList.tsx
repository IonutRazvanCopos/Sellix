import { useState } from 'react';
import { Listing } from '../../types';
import ListingItem from './ListingItem';
import ListingModal from './ListingModal';

interface Props {
  listings: Listing[];
  onApprove?: (id: number) => void;
  onHide?: (id: number) => void;
  onUnhide?: (id: number) => void;
  type?: 'pending' | 'hidden';
}

export default function ListingList({
  listings,
  onApprove,
  onHide,
  onUnhide,
  type = 'pending',
}: Props) {
  const [selected, setSelected] = useState<Listing | null>(null);

  return (
    <>
      <ListingModal listing={selected} onClose={() => setSelected(null)} />

      <ul className="space-y-4">
        {listings.map((listing) => (
          <ListingItem
            key={listing.id}
            listing={listing}
            type={type}
            onApprove={onApprove}
            onHide={onHide}
            onUnhide={onUnhide}
            onView={setSelected}
          />
        ))}
      </ul>
    </>
  );
}