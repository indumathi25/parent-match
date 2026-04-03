import { describe, it, expect } from 'vitest';
import { formatMonthYear, formatFullMonthYear } from './date';

describe('Date formatting utilities', () => {
  const testDate = '2023-01-15';

  it('formatMonthYear should format correctly', () => {
    const result = formatMonthYear(testDate);
    expect(result).toContain('Jan');
    expect(result).toContain('2023');
  });

  it('formatFullMonthYear should format correctly', () => {
    const result = formatFullMonthYear(testDate);
    expect(result).toContain('January');
    expect(result).toContain('2023');
  });
});
