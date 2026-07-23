import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import * as AuthContext from '../context/AuthContext';
import * as vehicleService from '../services/vehicleService';

vi.mock('../context/AuthContext');
vi.mock('../services/vehicleService');

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockVehicles = [
    { _id: '1', make: 'Toyota', model: 'Camry', year: 2023, price: 25000, quantity: 5, condition: 'New' },
    { _id: '2', make: 'Honda', model: 'Accord', year: 2023, price: 28000, quantity: 1, condition: 'New' },
    { _id: '3', make: 'Ford', model: 'Mustang', year: 2022, price: 35000, quantity: 0, condition: 'Used' },
  ];

  const mockRecentVehicles = {
    data: {
      vehicles: [
        { _id: '4', make: 'Tesla', model: 'Model 3', year: 2024, price: 40000, quantity: 2, condition: 'New', createdAt: '2023-10-01T00:00:00Z' }
      ]
    }
  };

  it('renders admin dashboard with total value and low stock cards', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { firstName: 'Admin', role: 'admin' } });
    vi.mocked(vehicleService.getVehicles).mockResolvedValue({ data: mockVehicles });
    vi.mocked(vehicleService.searchVehicles).mockResolvedValue(mockRecentVehicles);

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Welcome message
      expect(screen.getByText(/Welcome back, Admin/i)).toBeInTheDocument();
      // Total Vehicles: 5 + 1 + 0 = 6
      expect(screen.getByText('6 Vehicles')).toBeInTheDocument();
      // Total Value: (25000 * 5) + (28000 * 1) + (35000 * 0) = 125000 + 28000 = 153000
      expect(screen.getByText('$153,000')).toBeInTheDocument();
      // Low Stock items (quantity < 3): Honda (1) and Ford (0) -> 2 items
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    // Check low stock cards render
    expect(screen.getByText('Honda Accord')).toBeInTheDocument();
    expect(screen.getByText('Ford Mustang')).toBeInTheDocument();
    
    // Check recent activity renders
    expect(screen.getByText('2024 Tesla Model 3')).toBeInTheDocument();
  });

  it('renders customer dashboard with only available vehicles and recent activity', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { firstName: 'Customer', role: 'customer' } });
    vi.mocked(vehicleService.getVehicles).mockResolvedValue({ data: mockVehicles });
    vi.mocked(vehicleService.searchVehicles).mockResolvedValue(mockRecentVehicles);

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Customer/i)).toBeInTheDocument();
      // Available Vehicles: Toyota (5) + Honda (1) = 6
      expect(screen.getByText('6 Vehicles')).toBeInTheDocument();
    });

    // Customers should NOT see Total Value or Low Stock metrics
    expect(screen.queryByText(/Total Inventory Value/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Low Stock Alerts/i)).not.toBeInTheDocument();
    
    // Check recent activity renders
    expect(screen.getByText('2024 Tesla Model 3')).toBeInTheDocument();
    
    // Check low stock cards do NOT render for customers
    expect(screen.queryByText('Honda Accord')).not.toBeInTheDocument();
  });
});
