import { useBorrowingRates } from './useBorrowingRates.ts';
import { useSyncRates } from './useSyncRates.ts';

export const useDashboard = () => {
  const { data: rawData = [], isLoading: isQueryLoading, isError } = useBorrowingRates();
  const syncMutation = useSyncRates();

  const handleSyncClick = () => {
    if (rawData.length === 0) syncMutation.mutate();
  };

  const latestDataPoint = rawData[rawData.length - 1] ?? null;

  return {
    rawData,
    latestDataPoint,
    isLoading: isQueryLoading || syncMutation.isPending,
    isError,
    syncMutation,
    handleSyncClick,
  };
};