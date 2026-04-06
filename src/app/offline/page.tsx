'use client';

import { WifiOff, RefreshCw, Zap } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="h-10 w-10 text-orange-600" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Dreams</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">You are Offline</h1>
        <p className="text-gray-600 mb-8">
          It looks like you have lost your internet connection. Some features may be unavailable until you reconnect.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-700 hover:to-red-700 transition-all"
        >
          <RefreshCw className="h-5 w-5" />
          Try Again
        </button>
        <p className="text-sm text-gray-400 mt-6">
          Your pending orders and tracked deliveries will sync automatically when you are back online.
        </p>
      </div>
    </div>
  );
}
