import React from 'react';
import { MainChart } from './MainChart.tsx';
import { StatusDisplay } from './StatusDisplay.tsx';
import { useDashboard } from '../hooks/useDashboard.ts';
import { formatFullMonthYear } from '../utils/date.ts';

export const Dashboard: React.FC = React.memo(() => {
  const {
    rawData,
    latestDataPoint,
    isLoading,
    isError,
    errorMessage,
    syncMutation,
    handleSyncClick,
  } = useDashboard();

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 md:px-8 py-4 md:py-8 flex flex-col flex-1 gap-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <img src="/ecb.png" alt="ECB Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            ECB Borrowing Dashboard
          </h1>
        </div>

        {latestDataPoint && !isLoading && !isError && (
          <div className="flex flex-col gap-1">
            <span className="text-base md:text-lg font-semibold text-gray-600">
              {formatFullMonthYear(latestDataPoint.period)}
            </span>
            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
              <span className="text-1xl md:text-2xl font-bold text-gray-900 leading-tight">
                {latestDataPoint.value.toFixed(4)}
              </span>
              <span className="text-md md:text-1xl font-medium text-gray-700">
                Percent per annum
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col relative min-h-[400px]">
          {isLoading && <StatusDisplay variant="loading" />}
          {isError && <StatusDisplay variant="error" errorMessage={errorMessage} />}

          {rawData.length === 0 && !isLoading && !isError && (
            <StatusDisplay
              variant="empty"
              onSync={handleSyncClick}
              isSyncing={syncMutation.isPending}
              errorMessage={errorMessage}
            />
          )}

          {rawData.length > 0 && !isLoading && !isError && (
            <div className="flex-1">
              <MainChart data={rawData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
