import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from './DashboardPage';
import * as AuthContext from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the DashboardCard component
vi.mock('../components/DashboardCard', () => ({
  default: ({ title, value }) => <div data-testid="dashboard-card">{title}: {value}</div>
}));

describe('DashboardPage', () => {
  it('renders dashboard cards and welcome message', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { firstName: 'Alice' } });
    
    render(<DashboardPage />);

    expect(screen.getByText('Welcome back, Alice!')).toBeInTheDocument();
    
    // Check if cards rendered
    expect(screen.getByText('Total Vehicles: 124')).toBeInTheDocument();
    expect(screen.getByText('Total Value: $3.2M')).toBeInTheDocument();
    expect(screen.getByText('Low Stock: 5')).toBeInTheDocument();
  });
});
