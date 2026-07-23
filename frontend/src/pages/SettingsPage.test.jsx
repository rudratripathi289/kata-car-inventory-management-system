import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from './SettingsPage';
import * as AuthContext from '../context/AuthContext';

vi.mock('../context/AuthContext');

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    vi.mocked(AuthContext.useAuth).mockReturnValue({ 
      user: { firstName: 'Test', role: 'admin' } 
    });
  });

  it('renders Settings header and tabs', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preferences/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /account security/i })).toBeInTheDocument();
  });

  it('defaults to Preferences tab and allows switching', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    // Initial state
    expect(screen.getByText('Visual Preferences')).toBeInTheDocument();
    
    // Switch to Notifications
    fireEvent.click(screen.getByRole('button', { name: /notifications/i }));
    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    
    // Switch to Account
    fireEvent.click(screen.getByRole('button', { name: /account security/i }));
    expect(screen.getByText('Password changes are currently disabled by the system administrator.')).toBeInTheDocument();
  });

  it('toggles settings and saves to localStorage', async () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    // Initial default theme should be 'light' and density 'comfortable'
    let prefs = JSON.parse(localStorage.getItem('userPreferences'));
    expect(prefs.theme).toBe('light');

    // Change to dark theme
    const darkButton = screen.getByRole('button', { name: /dark/i });
    fireEvent.click(darkButton);

    // Verify localStorage updated
    prefs = JSON.parse(localStorage.getItem('userPreferences'));
    expect(prefs.theme).toBe('dark');

    // Click Save button
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));
    
    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
    });
  });
});
