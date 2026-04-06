'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2, X, Navigation, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Address } from '@/types';

interface AddressAutocompleteProps {
  label?: string;
  value?: Address;
  onChange: (address: Address) => void;
  placeholder?: string;
  error?: string;
  showSavedAddresses?: boolean;
  showCurrentLocation?: boolean;
  className?: string;
}

const savedAddresses: { label: string; address: Address }[] = [
  { label: 'Office / HQ', address: { street: '100 Main Street', city: 'Houston', state: 'TX', zip: '77001', country: 'US', lat: 29.760, lng: -95.370 } },
  { label: 'Westfield Tower Job Site', address: { street: '742 Evergreen Terrace', city: 'Houston', state: 'TX', zip: '77002', country: 'US', lat: 29.762, lng: -95.367 } },
  { label: 'Warehouse #3', address: { street: '4500 Warehouse Row', city: 'Houston', state: 'TX', zip: '77003', country: 'US', lat: 29.755, lng: -95.358 } },
];

const mockSuggestions = [
  { street: '1250 Industrial Blvd', city: 'Houston', state: 'TX', zip: '77001', country: 'US' },
  { street: '1255 Industrial Park Dr', city: 'Houston', state: 'TX', zip: '77001', country: 'US' },
  { street: '1260 Industry Way', city: 'Houston', state: 'TX', zip: '77015', country: 'US' },
  { street: '890 Tech Park Dr', city: 'Dallas', state: 'TX', zip: '75201', country: 'US' },
  { street: '555 Commerce St', city: 'Austin', state: 'TX', zip: '78701', country: 'US' },
];

export function AddressAutocomplete({
  label,
  value,
  onChange,
  placeholder = 'Start typing an address...',
  error,
  showSavedAddresses = true,
  showCurrentLocation = true,
  className,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value?.street || '');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [locatingUser, setLocatingUser] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (val.length >= 3) {
      setLoading(true);
      // Simulate geocoding API delay
      setTimeout(() => {
        const filtered = mockSuggestions.filter((s) =>
          s.street.toLowerCase().includes(val.toLowerCase()) ||
          s.city.toLowerCase().includes(val.toLowerCase())
        );
        setSuggestions(filtered.length > 0 ? filtered : mockSuggestions.slice(0, 3));
        setLoading(false);
        setIsOpen(true);
      }, 300);
    } else {
      setSuggestions([]);
      setIsOpen(val.length === 0 && showSavedAddresses);
    }
  };

  const handleSelect = (address: Address) => {
    setQuery(address.street);
    onChange(address);
    setIsOpen(false);
  };

  const handleCurrentLocation = () => {
    setLocatingUser(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const address: Address = {
            street: 'Current Location',
            city: 'Houston',
            state: 'TX',
            zip: '77001',
            country: 'US',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          handleSelect(address);
          setLocatingUser(false);
        },
        () => {
          setLocatingUser(false);
        }
      );
    } else {
      setLocatingUser(false);
    }
  };

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all',
            'focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none',
            error && 'border-red-500'
          )}
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-orange-500" />}
        {query && !loading && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); setIsOpen(true); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-auto">
          {/* Current Location */}
          {showCurrentLocation && (
            <button
              onClick={handleCurrentLocation}
              disabled={locatingUser}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-orange-50 transition-colors border-b border-gray-100"
            >
              {locatingUser ? (
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              ) : (
                <Navigation className="h-4 w-4 text-orange-600" />
              )}
              <span className="font-medium text-orange-700">Use current location</span>
            </button>
          )}

          {/* Saved Addresses */}
          {showSavedAddresses && !query && (
            <>
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Saved Addresses</p>
              </div>
              {savedAddresses.map((saved) => (
                <button
                  key={saved.label}
                  onClick={() => handleSelect(saved.address)}
                  className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <Star className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{saved.label}</p>
                    <p className="text-xs text-gray-500">{saved.address.street}, {saved.address.city}, {saved.address.state} {saved.address.zip}</p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Recent Searches */}
          {!query && (
            <>
              <div className="px-4 py-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent</p>
              </div>
              <button
                onClick={() => handleSelect({ street: '742 Evergreen Terrace', city: 'Houston', state: 'TX', zip: '77002', country: 'US' })}
                className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
              >
                <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">742 Evergreen Terrace</p>
                  <p className="text-xs text-gray-400">Houston, TX 77002</p>
                </div>
              </button>
            </>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && query && (
            <>
              <div className="px-4 py-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggestions</p>
              </div>
              {suggestions.map((address, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(address)}
                  className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-orange-50 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900">{address.street}</p>
                    <p className="text-xs text-gray-500">{address.city}, {address.state} {address.zip}</p>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
