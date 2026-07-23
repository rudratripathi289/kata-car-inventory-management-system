import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';

import DashboardPage from '../pages/DashboardPage';
import DashboardLayout from '../layouts/DashboardLayout';
import VehiclesPage from '../pages/VehiclesPage';
import VehicleFormPage from '../pages/VehicleFormPage';
import VehicleDetailPage from '../pages/VehicleDetailPage';
import PurchasePage from '../pages/PurchasePage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehicles" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <VehiclesPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehicles/new" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <DashboardLayout>
              <VehicleFormPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehicles/:id/edit" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <DashboardLayout>
              <VehicleFormPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehicles/:id" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <VehicleDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehicles/:id/purchase" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PurchasePage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default AppRoutes;
