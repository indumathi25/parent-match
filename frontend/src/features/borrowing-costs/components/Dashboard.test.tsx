import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { useDashboard } from '../hooks/useDashboard';

vi.mock('../hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

vi.mock('./MainChart', () => ({
  MainChart: () => <div data-testid="main-chart" />,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    (useDashboard as any).mockReturnValue({
      rawData: [],
      latestDataPoint: null,
      isLoading: true,
      isError: false,
      syncMutation: { isPending: false },
      handleSyncClick: vi.fn(),
    });

    render(<Dashboard />);
    expect(screen.getByText(/Loading market data.../i)).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    (useDashboard as any).mockReturnValue({
      rawData: [],
      latestDataPoint: null,
      isLoading: false,
      isError: true,
      syncMutation: { isPending: false },
      handleSyncClick: vi.fn(),
    });

    render(<Dashboard />);
    expect(screen.getByText(/Failed to fetch data from the API/i)).toBeInTheDocument();
  });

  it('renders empty state correctly with sync button', () => {
    (useDashboard as any).mockReturnValue({
      rawData: [],
      latestDataPoint: null,
      isLoading: false,
      isError: false,
      syncMutation: { isPending: false },
      handleSyncClick: vi.fn(),
    });

    render(<Dashboard />);
    expect(screen.getByText(/click on the button to see the ecb data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sync Initial Data/i })).toBeInTheDocument();
  });

  it('renders latest values and chart when data is present', () => {
    const mockData = [
      { period: '2026-02', value: 3.37, unit: 'Percentage' },
    ];
    (useDashboard as any).mockReturnValue({
      rawData: mockData,
      latestDataPoint: mockData[0],
      isLoading: false,
      isError: false,
      syncMutation: { isPending: false },
      handleSyncClick: vi.fn(),
    });

    render(<Dashboard />);

    expect(screen.getByText(/February 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/3.3700/i)).toBeInTheDocument();
    expect(screen.getByTestId('main-chart')).toBeInTheDocument();
  });
});
