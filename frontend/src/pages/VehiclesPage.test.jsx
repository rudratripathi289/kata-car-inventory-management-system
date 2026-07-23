import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import VehiclesPage from './VehiclesPage';
import * as vehicleService from '../services/vehicleService';
import * as AuthContext from '../context/AuthContext';

vi.mock('../services/vehicleService');
vi.mock('../context/AuthContext');

describe('VehiclesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'user' } });
    vi.mocked(vehicleService.searchVehicles).mockReturnValue(new Promise(() => {})); // Never resolves
    
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading vehicles/i)).toBeInTheDocument();
  });

  it('renders vehicles after successful fetch', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'user' } });
    
    const mockData = {
      data: {
        vehicles: [
          { _id: '1', make: 'Toyota', model: 'Camry', year: 2023, price: 25000, quantity: 5, condition: 'New' }
        ],
        pages: 1,
        total: 1
      }
    };
    
    vi.mocked(vehicleService.searchVehicles).mockResolvedValue(mockData);

    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    });
    expect(screen.getByText('$25000')).toBeInTheDocument();
    expect(screen.queryByText(/loading vehicles/i)).not.toBeInTheDocument();
  });

  it('shows add vehicle button for admins', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'admin' } });
    vi.mocked(vehicleService.searchVehicles).mockResolvedValue({ data: { vehicles: [], pages: 1, total: 0 } });

    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /add vehicle/i })).toBeInTheDocument();
    });
  });

  it('hides add vehicle button for normal users', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'user' } });
    vi.mocked(vehicleService.searchVehicles).mockResolvedValue({ data: { vehicles: [], pages: 1, total: 0 } });

    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: /add vehicle/i })).not.toBeInTheDocument();
    });
  });
});
