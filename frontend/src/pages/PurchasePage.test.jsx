import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import PurchasePage from './PurchasePage';
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

describe('PurchasePage', () => {
  const mockVehicle = {
    data: {
      _id: '1',
      vin: '1HGCM82',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 25000,
      quantity: 5,
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={['/vehicles/1/purchase']}>
        <Routes>
          <Route path="/vehicles/:id/purchase" element={<PurchasePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders vehicle details for purchase', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'user' } });
    vi.mocked(vehicleService.getVehicleById).mockResolvedValue(mockVehicle);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/checkout: 2023 toyota camry/i)).toBeInTheDocument();
    });
    expect(screen.getByText('$25,000.00')).toBeInTheDocument();
  });

  it('handles successful purchase', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'user' } });
    vi.mocked(vehicleService.getVehicleById).mockResolvedValue(mockVehicle);
    vi.mocked(vehicleService.purchaseVehicle).mockResolvedValue({ data: { message: 'Success' } });
    
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /confirm purchase/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /confirm purchase/i }));

    await waitFor(() => {
      expect(vehicleService.purchaseVehicle).toHaveBeenCalledWith('1', 1);
    });

    expect(screen.getByText(/purchase successful/i)).toBeInTheDocument();
  });

  it('shows out of stock message if quantity is 0', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { role: 'user' } });
    vi.mocked(vehicleService.getVehicleById).mockResolvedValue({
      data: { ...mockVehicle.data, quantity: 0 }
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/this vehicle is currently out of stock/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /confirm purchase/i })).toBeDisabled();
  });
});
