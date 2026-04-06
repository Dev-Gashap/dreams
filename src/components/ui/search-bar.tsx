'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, SlidersHorizontal, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterToggle?: () => void;
  placeholder?: string;
  showUrgent?: boolean;
  isUrgent?: boolean;
  onUrgentToggle?: () => void;
  loading?: boolean;
  suggestions?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar({
  onSearch,
  onFilterToggle,
  placeholder = 'Search tools, materials, parts...',
  showUrgent = true,
  isUrgent,
  onUrgentToggle,
  loading,
  suggestions,
  className,
  size = 'md',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: 'py-2 pl-9 pr-4 text-sm',
    md: 'py-3 pl-11 pr-4 text-base',
    lg: 'py-4 pl-14 pr-6 text-lg',
  };

  const iconSizes = {
    sm: 'h-4 w-4 left-2.5',
    md: 'h-5 w-5 left-3.5',
    lg: 'h-6 w-6 left-4',
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const quickCategories = Object.entries(CATEGORY_LABELS).slice(0, 6);

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={cn('absolute top-1/2 -translate-y-1/2 text-gray-400', iconSizes[size])} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200',
              'focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none',
              sizes[size]
            )}
          />
          {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-orange-500" />}
          {query && !loading && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showUrgent && (
          <button
            type="button"
            onClick={onUrgentToggle}
            className={cn(
              'flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 whitespace-nowrap',
              isUrgent
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50'
            )}
          >
            <Zap className={cn('h-4 w-4', isUrgent && 'fill-orange-500')} />
            Urgent
          </button>
        )}

        {onFilterToggle && (
          <button
            type="button"
            onClick={onFilterToggle}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-medium text-sm transition-all duration-200"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        )}
      </form>

      {showSuggestions && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Categories</p>
          <div className="flex flex-wrap gap-2">
            {quickCategories.map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setQuery(label); onSearch(label); setShowSuggestions(false); }}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showSuggestions && suggestions && suggestions.length > 0 && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setQuery(s); onSearch(s); setShowSuggestions(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors flex items-center gap-2"
            >
              <Search className="h-3.5 w-3.5 text-gray-400" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
