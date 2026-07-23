import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import VehicleFormPage from './VehicleFormPage';
import * as vehicleService from '../services/vehicleService';
import * as AuthContext from '../context/AuthContext';

vi.mock('../services/vehicleService');
vi.mock('../context/AuthContext');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('VehicleFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (initialPath = '/vehicles/new', routePath = '/vehicles/new') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path={routePath} element={<VehicleFormPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders add vehicle form when no ID is provided', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'admin' } });
    renderWithRouter();
    
    expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save vehicle/i })).toBeInTheDocument();
  });

  it('handles vehicle creation successfully', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'admin' } });
    vi.mocked(vehicleService.createVehicle).mockResolvedValue({ data: { _id: '123' } });
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: 'Honda' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Civic' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '2024' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '22000' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/vin/i), { target: { value: '1HGCM82633A004' } });
    
    fireEvent.click(screen.getByRole('button', { name: /save vehicle/i }));

    await waitFor(() => {
      expect(vehicleService.createVehicle).toHaveBeenCalledWith(expect.objectContaining({
        make: 'Honda',
        model: 'Civic',
        year: 2024,
        price: 22000,
        quantity: 10,
        vin: '1HGCM82633A004'
      }));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/vehicles');
  });
});
