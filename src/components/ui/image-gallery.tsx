'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Maximize2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ImageGallery({ images, productName, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const hasImages = images.length > 0;
  const placeholderCount = Math.max(4, images.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const goNext = () => setActiveIndex((prev) => (prev + 1) % placeholderCount);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + placeholderCount) % placeholderCount);

  const mainImage = (
    <div
      ref={imageRef}
      className={cn(
        'relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer transition-all',
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black' : 'aspect-square',
        className
      )}
      onClick={() => setIsZoomed(!isZoomed)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsZoomed(false)}
    >
      {hasImages ? (
        <div
          className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-200"
          style={{
            backgroundImage: `url(${images[activeIndex]})`,
            transform: isZoomed ? 'scale(2)' : 'scale(1)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Package className={cn('text-gray-300', isFullscreen ? 'h-32 w-32' : 'h-24 w-24')} />
          <p className="text-sm text-gray-400">{productName}</p>
        </div>
      )}

      {/* Navigation Arrows */}
      {placeholderCount > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Controls */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
          className="h-8 w-8 rounded-lg bg-white/90 shadow-sm flex items-center justify-center text-gray-600 hover:bg-white"
        >
          {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setIsFullscreen(!isFullscreen); }}
          className="h-8 w-8 rounded-lg bg-white/90 shadow-sm flex items-center justify-center text-gray-600 hover:bg-white"
        >
          {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Image Counter */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-xs font-medium">
        {activeIndex + 1} / {placeholderCount}
      </div>
    </div>
  );

  return (
    <div className="group">
      {isFullscreen && <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setIsFullscreen(false)} />}
      {mainImage}

      {/* Thumbnail Strip */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {Array.from({ length: placeholderCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'h-16 w-16 rounded-xl flex-shrink-0 flex items-center justify-center border-2 transition-all',
              i === activeIndex
                ? 'border-orange-500 ring-2 ring-orange-500/20'
                : 'border-gray-200 hover:border-gray-300',
              hasImages ? 'bg-gray-100' : 'bg-gradient-to-br from-gray-100 to-gray-50'
            )}
          >
            {hasImages && images[i] ? (
              <div className="w-full h-full bg-contain bg-center bg-no-repeat rounded-lg" style={{ backgroundImage: `url(${images[i]})` }} />
            ) : (
              <Package className="h-6 w-6 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
