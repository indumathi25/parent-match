import { useQuery } from '@tanstack/react-query';
import { borrowingRatesApi } from '../api.ts';
import type { DataPoint } from '../types/index.ts';

export const useBorrowingRates = () => {
    return useQuery<Array<DataPoint>>({
        queryKey: ['ecbData'],
        queryFn: () => borrowingRatesApi.getAll(),
    });
};