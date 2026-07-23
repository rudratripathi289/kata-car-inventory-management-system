import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import * as AuthContext from '../context/AuthContext';
import * as purchaseService from '../services/purchaseService';

vi.mock('../context/AuthContext');
vi.mock('../services/purchaseService');

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(purchaseService.getMyPurchases).mockResolvedValue([]);
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders user profile information', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ 
      user: { 
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        role: 'admin'
      } 
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders fallback when phone is missing', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ 
      user: { 
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'customer'
      } 
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Not provided')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
  });

  it('renders purchase history and metrics correctly', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ 
      user: { 
        firstName: 'Buyer',
        lastName: 'Bob',
        email: 'bob@example.com',
        role: 'customer'
      } 
    });

    const mockPurchases = [
      {
        _id: 'p1',
        purchasedAt: '2026-07-20T10:00:00.000Z',
        quantity: 2,
        totalPrice: 50000,
        vehicleId: {
          make: 'Toyota',
          model: 'Camry',
          year: 2023,
          price: 25000
        }
      },
      {
        _id: 'p2',
        purchasedAt: '2026-07-22T14:30:00.000Z',
        quantity: 1,
        totalPrice: 35000,
        vehicleId: {
          make: 'Ford',
          model: 'Mustang',
          year: 2022,
          price: 35000
        }
      }
    ];

    vi.mocked(purchaseService.getMyPurchases).mockResolvedValue(mockPurchases);

    renderWithRouter();

    await waitFor(() => {
      // Check metrics
      expect(screen.getByText(/Total Expense/i)).toBeInTheDocument();
      expect(screen.getByText(/\$85,000\.00|85000\.00/)).toBeInTheDocument(); // 50000 + 35000
      
      expect(screen.getByText(/Owned Cars/i)).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // 2 + 1
      
      // Check history table
      expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });
});
