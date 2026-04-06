import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function formatETA(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function generateOrderNumber() {
  const prefix = 'DRM';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending_approval: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-indigo-100 text-indigo-700',
    ready_for_pickup: 'bg-purple-100 text-purple-700',
    dispatched: 'bg-orange-100 text-orange-700',
    in_transit: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    returned: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    assigned: 'bg-blue-100 text-blue-700',
    accepted: 'bg-blue-100 text-blue-700',
    en_route_to_pickup: 'bg-orange-100 text-orange-700',
    arrived_at_pickup: 'bg-purple-100 text-purple-700',
    picked_up: 'bg-indigo-100 text-indigo-700',
    en_route_to_delivery: 'bg-orange-100 text-orange-700',
    arrived_at_delivery: 'bg-purple-100 text-purple-700',
    failed: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    standard: 'bg-gray-100 text-gray-700',
    urgent: 'bg-orange-100 text-orange-700 border border-orange-300',
    critical: 'bg-red-100 text-red-700 border border-red-300 animate-pulse',
  };
  return colors[priority] || 'bg-gray-100 text-gray-700';
}

export function formatStatus(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export const CATEGORY_LABELS: Record<string, string> = {
  power_tools: 'Power Tools',
  hand_tools: 'Hand Tools',
  safety_equipment: 'Safety Equipment',
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  hvac: 'HVAC',
  fasteners: 'Fasteners & Hardware',
  lumber: 'Lumber & Wood',
  concrete: 'Concrete & Masonry',
  roofing: 'Roofing',
  flooring: 'Flooring',
  paint: 'Paint & Coatings',
  adhesives: 'Adhesives & Sealants',
  measuring: 'Measuring & Layout',
  welding: 'Welding',
  automotive: 'Automotive',
  heavy_equipment: 'Heavy Equipment',
  landscaping: 'Landscaping',
  telecom: 'Telecom & Cable',
  networking: 'Networking & IT',
  replacement_parts: 'Replacement Parts',
  consumables: 'Consumables',
  other: 'Other',
};
