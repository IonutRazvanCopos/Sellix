import React from 'react';
import { TFunction } from 'i18next';
import { useNavigate } from 'react-router-dom';

interface ListingCardProps {
    listing: {
        id: number;
        title: string;
        description: string;
        price: number;
        currency: string;
        type: string;
        createdAt: string;
        user: { username: string; id: number };
        category?: { name: string };
        images?: { url: string }[];
        t: TFunction
        navigate: ReturnType<typeof useNavigate>;
    };
    navigate: (path: string) => void;
    t: (key: string, defaultValue?: string) => string;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, navigate, t }) => {
    return (
        <div
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200 group focus:outline-none"
            onClick={() => navigate(`/listing/${listing.id}`)}
            tabIndex={0}
            role="button"
            onKeyPress={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/listing/${listing.id}`);
                }
            }}
        >
            <div className="relative">
                {listing.images && listing.images.length > 0 ? (
                    <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-300">
                        <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <span className="absolute top-3 right-3 bg-white/80 text-xs text-gray-700 px-2 py-1 rounded-full shadow">
                    {t(`categories.${listing.category?.name}`, listing.category?.name)}
                </span>
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{listing.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-bold text-indigo-600">
                        {listing.price} {listing.currency}
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                            {listing.user.username[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500">{listing.user.username}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;