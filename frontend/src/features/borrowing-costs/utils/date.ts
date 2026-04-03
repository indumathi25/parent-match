import type { DataPoint } from '../types/index.ts';

export const getFirstPeriod = (data: Array<DataPoint>): string =>
  data[0]?.period ?? '';

export const getLastPeriod = (data: Array<DataPoint>): string =>
  data[data.length - 1]?.period ?? '';

export const toTimestamp = (dateString: string): number =>
  new Date(dateString).getTime();

export const formatMonthYear = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const formatFullMonthYear = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
