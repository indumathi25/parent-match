import { useMutation, useQueryClient } from '@tanstack/react-query';
import { borrowingRatesApi } from '../api.ts';

export const useSyncRates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => borrowingRatesApi.sync(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ecbData'] });
    }
  });
};
