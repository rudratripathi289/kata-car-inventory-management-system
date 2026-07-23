import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

import DashboardPage from '../pages/DashboardPage';
import DashboardLayout from '../layouts/DashboardLayout';
import VehiclesPage from '../pages/VehiclesPage';
import VehicleFormPage from '../pages/VehicleFormPage';

const TempHome = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Home</h1>
    <div className="space-x-4">
      <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
      <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard (Protected)</Link>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TempHome />} />
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
    </Routes>
  );
}

export default AppRoutes;
