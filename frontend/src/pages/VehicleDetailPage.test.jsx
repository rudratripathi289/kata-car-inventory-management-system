import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import VehicleDetailPage from './VehicleDetailPage';
import * as vehicleService from '../services/vehicleService';
import * as AuthContext from '../context/AuthContext';

vi.mock('../services/vehicleService');
vi.mock('../context/AuthContext');

describe('VehicleDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (initialPath = '/vehicles/1', routePath = '/vehicles/:id') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path={routePath} element={<VehicleDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders loading state initially', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'user' } });
    vi.mocked(vehicleService.getVehicleById).mockReturnValue(new Promise(() => {}));
    
    renderWithRouter();

    expect(screen.getByText(/loading vehicle details/i)).toBeInTheDocument();
  });

  it('renders vehicle details after successful fetch', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'user' } });
    
    const mockVehicle = {
      data: {
        _id: '1',
        vin: '1HGCM82',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 25000,
        quantity: 5,
        condition: 'New',
        category: 'Sedan',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        color: 'Silver',
        mileage: 100,
        engine: '2.5L 4-Cylinder',
        description: 'A great car.',
        features: ['Bluetooth', 'Backup Camera']
      }
    };
    
    vi.mocked(vehicleService.getVehicleById).mockResolvedValue(mockVehicle);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('2023 Toyota Camry')).toBeInTheDocument();
    });
    
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText('100 miles')).toBeInTheDocument();
    expect(screen.getByText('A great car.')).toBeInTheDocument();
    expect(screen.queryByText(/loading vehicle details/i)).not.toBeInTheDocument();
  });

  it('shows error message if API fails', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'user' } });
    vi.mocked(vehicleService.getVehicleById).mockRejectedValue(new Error('API Error'));

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Failed to load vehicle details')).toBeInTheDocument();
    });
  });
});
