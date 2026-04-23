'use client';

import {
  Wrench,
  Hammer,
  Zap,
  Cable,
  Cpu,
  Shield,
  Package,
  Ruler,
  HardHat,
  Paintbrush,
  Truck,
  Drill,
  Wind,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  productId: string;
  category?: string;
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

// Category to icon + gradient mapping for visual variety
const categoryVisuals: Record<string, { icon: typeof Wrench; from: string; to: string; text: string }> = {
  power_tools: { icon: Drill, from: 'from-orange-400', to: 'to-red-500', text: 'text-orange-700' },
  hand_tools: { icon: Hammer, from: 'from-amber-400', to: 'to-orange-500', text: 'text-amber-700' },
  safety_equipment: { icon: HardHat, from: 'from-yellow-400', to: 'to-amber-500', text: 'text-yellow-700' },
  electrical: { icon: Zap, from: 'from-blue-400', to: 'to-indigo-500', text: 'text-blue-700' },
  plumbing: { icon: Wrench, from: 'from-cyan-400', to: 'to-blue-500', text: 'text-cyan-700' },
  hvac: { icon: Wind, from: 'from-sky-400', to: 'to-blue-500', text: 'text-sky-700' },
  fasteners: { icon: Package, from: 'from-slate-400', to: 'to-gray-500', text: 'text-slate-700' },
  lumber: { icon: Package, from: 'from-amber-500', to: 'to-orange-700', text: 'text-amber-800' },
  concrete: { icon: Package, from: 'from-stone-400', to: 'to-gray-500', text: 'text-stone-700' },
  roofing: { icon: Package, from: 'from-zinc-400', to: 'to-slate-500', text: 'text-zinc-700' },
  flooring: { icon: Package, from: 'from-amber-300', to: 'to-yellow-500', text: 'text-amber-700' },
  paint: { icon: Paintbrush, from: 'from-rose-400', to: 'to-pink-500', text: 'text-rose-700' },
  adhesives: { icon: Package, from: 'from-lime-400', to: 'to-green-500', text: 'text-lime-700' },
  measuring: { icon: Ruler, from: 'from-violet-400', to: 'to-purple-500', text: 'text-violet-700' },
  welding: { icon: Flame, from: 'from-red-500', to: 'to-orange-600', text: 'text-red-700' },
  automotive: { icon: Truck, from: 'from-indigo-400', to: 'to-blue-600', text: 'text-indigo-700' },
  heavy_equipment: { icon: Truck, from: 'from-yellow-500', to: 'to-orange-600', text: 'text-yellow-800' },
  landscaping: { icon: Package, from: 'from-green-400', to: 'to-emerald-500', text: 'text-green-700' },
  telecom: { icon: Cable, from: 'from-teal-400', to: 'to-cyan-500', text: 'text-teal-700' },
  networking: { icon: Cpu, from: 'from-purple-400', to: 'to-violet-500', text: 'text-purple-700' },
  replacement_parts: { icon: Package, from: 'from-neutral-400', to: 'to-gray-500', text: 'text-neutral-700' },
  consumables: { icon: Package, from: 'from-gray-400', to: 'to-slate-500', text: 'text-gray-700' },
  other: { icon: Package, from: 'from-gray-400', to: 'to-slate-500', text: 'text-gray-700' },
};

const iconSizes = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
  full: 'h-32 w-32',
};

export function ProductImage({
  productId,
  category = 'other',
  src,
  name,
  size = 'md',
  className,
}: ProductImageProps) {
  // If there's a real image, use it
  if (src) {
    return (
      <div className={cn('relative bg-white rounded-lg overflow-hidden', className)}>
        <img
          src={src}
          alt={name || 'Product'}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  const visual = categoryVisuals[category] || categoryVisuals.other;
  const Icon = visual.icon;

  // Deterministic shade variation based on product ID
  const hash = productId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shade = hash % 3; // 0, 1, or 2

  const shadeStyles = [
    'from-white via-gray-50 to-gray-100',
    'from-gray-50 via-white to-gray-50',
    'from-white via-gray-50 to-white',
  ];

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden bg-gradient-to-br flex items-center justify-center group',
        shadeStyles[shade],
        className
      )}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 15px)`,
        }}
      />

      {/* Category accent corner */}
      <div className={cn('absolute top-0 left-0 w-16 h-16 rounded-br-full bg-gradient-to-br opacity-10', visual.from, visual.to)} />

      {/* Icon */}
      <div className={cn('relative z-10 transition-transform group-hover:scale-110 duration-300', visual.text)}>
        <Icon className={iconSizes[size]} strokeWidth={1.2} />
      </div>

      {/* Bottom shine */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/40 to-transparent" />
    </div>
  );
}
