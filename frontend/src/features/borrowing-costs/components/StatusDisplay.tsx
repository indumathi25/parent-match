import React from 'react';
import type { StatusDisplayProps } from '../types/index.ts';

export const StatusDisplay: React.FC<StatusDisplayProps> = React.memo(({ variant, onSync, isSyncing, errorMessage }) => {
  switch (variant) {
    case 'loading':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary h-full">
          <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-4" />
          <p>Loading market data...</p>
        </div>
      );
    case 'error':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-red-600 bg-red-50 rounded-lg">
          <p className="font-semibold mb-2 text-center">
            {errorMessage || 'Failed to fetch data from the API. Please try again later.'}
          </p>
        </div>
      );
    case 'empty':
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full">
          <p className="mb-4 text-text-secondary">click on the button to see the ecb data</p>
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50"
          >
            {isSyncing ? 'Syncing...' : 'Sync Initial Data'}
          </button>
        </div>
      );
    default:
      return null;
  }
});
