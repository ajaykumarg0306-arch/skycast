import React from 'react';
import { X, Star, Trash2, MapPin, ExternalLink } from 'lucide-react';
import { SavedLocation } from '../types/weather';
import { LocationTarget } from '../hooks/useWeather';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: SavedLocation[];
  onSelect: (loc: LocationTarget) => void;
  onRemove: (id: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelect,
  onRemove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl border border-white/20 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Favorite Locations
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 max-h-80 overflow-y-auto no-scrollbar space-y-2">
          {favorites.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              <Star className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="font-medium text-slate-700 dark:text-slate-300">No favorite cities yet</p>
              <p className="mt-1">
                Click the star icon on any city&apos;s weather card to save it here for quick access.
              </p>
            </div>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors group"
              >
                <button
                  onClick={() => {
                    onSelect({
                      name: fav.name,
                      region: fav.region,
                      country: fav.country,
                      latitude: fav.latitude,
                      longitude: fav.longitude,
                    });
                    onClose();
                  }}
                  className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {fav.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {[fav.region, fav.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                </button>

                <button
                  onClick={() => onRemove(fav.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0 ml-2"
                  title="Remove from favorites"
                  aria-label="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
