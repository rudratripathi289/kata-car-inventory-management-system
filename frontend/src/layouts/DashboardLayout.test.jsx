import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import * as AuthContext from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('DashboardLayout', () => {
  it('renders Navbar, Sidebar, Footer, and children', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { firstName: 'Admin', role: 'admin' }, logout: vi.fn() });
    
    render(
      <MemoryRouter>
        <DashboardLayout>
          <div data-testid="dashboard-content">Main Content Here</div>
        </DashboardLayout>
      </MemoryRouter>
    );

    // Navbar
    expect(screen.getByText('Car Dealership Admin')).toBeInTheDocument();
    
    // Sidebar
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    
    // Footer
    expect(screen.getByText(/© \d{4} Car Dealership Inventory System/i)).toBeInTheDocument();

    // Children content
    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
  });
});
