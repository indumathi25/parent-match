import { useBorrowingRates } from './useBorrowingRates.ts';
import { useSyncRates } from './useSyncRates.ts';

export const useDashboard = () => {
  const { 
    data: rawData = [], 
    isLoading: isQueryLoading, 
    isError: isQueryError,
    error: queryError 
  } = useBorrowingRates();
  
  const syncMutation = useSyncRates();

  const handleSyncClick = () => {
    if (rawData.length === 0) syncMutation.mutate();
  };

  const latestDataPoint = rawData[rawData.length - 1] ?? null;
  
  const isError = isQueryError || syncMutation.isError;
  const errorMessage = (syncMutation.error as Error)?.message || (queryError as Error)?.message;

  return {
    rawData,
    latestDataPoint,
    isLoading: isQueryLoading || syncMutation.isPending,
    isError,
    errorMessage,
    syncMutation,
    handleSyncClick,
  };
};