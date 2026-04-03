import { apiClient } from '../../core/api/client.ts';
import type { DataPoint } from './types/index.ts';
import { API_PATHS } from './constants/index.ts';

export const borrowingRatesApi = {
  getAll: async (): Promise<Array<DataPoint>> => {
    return apiClient.get<Array<DataPoint>>(API_PATHS.DATA);
  },

  sync: async (): Promise<void> => {
    return apiClient.post(API_PATHS.INGEST);
  },
};
