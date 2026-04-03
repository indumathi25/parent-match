import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MainChart } from './MainChart';

vi.mock('react-chartjs-2', () => ({
  Line: ({ data }: any) => (
    <div data-testid="chart-mock" data-points={data.datasets[0].data.length} />
  ),
}));

describe('MainChart Component', () => {
  it('renders correctly with given data points', () => {
    const mockData = [
      { period: '2026-01', value: 3.25, unit: 'Percentage' },
      { period: '2026-02', value: 3.37, unit: 'Percentage' },
    ];

    const { getByTestId } = render(<MainChart data={mockData} />);
    const chart = getByTestId('chart-mock');

    expect(chart).toBeInTheDocument();
    expect(chart.getAttribute('data-points')).toBe('2');
  });

  it('handles empty data gracefully', () => {
    const { getByTestId } = render(<MainChart data={[]} />);
    const chart = getByTestId('chart-mock');

    expect(chart).toBeInTheDocument();
    expect(chart.getAttribute('data-points')).toBe('0');
  });
});
