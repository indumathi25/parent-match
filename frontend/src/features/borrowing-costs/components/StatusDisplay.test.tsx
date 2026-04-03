import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusDisplay } from './StatusDisplay';

describe('StatusDisplay Component', () => {
  it('renders loading state correctly', () => {
    render(<StatusDisplay variant="loading" />);
    expect(screen.getByText(/Loading market data.../i)).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    render(<StatusDisplay variant="error" />);
    expect(screen.getByText(/Failed to fetch data from the API/i)).toBeInTheDocument();
  });

  it('renders empty state correctly with button', () => {
    const onSyncMock = vi.fn();
    render(<StatusDisplay variant="empty" onSync={onSyncMock} />);
    
    expect(screen.getByText(/click on the button to see the ecb data/i)).toBeInTheDocument();
    
    const button = screen.getByRole('button', { name: /Sync Initial Data/i });
    fireEvent.click(button);
    
    expect(onSyncMock).toHaveBeenCalledTimes(1);
  });

  it('disables button when isSyncing is true', () => {
    render(<StatusDisplay variant="empty" isSyncing={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText(/Syncing.../i)).toBeInTheDocument();
  });
});
