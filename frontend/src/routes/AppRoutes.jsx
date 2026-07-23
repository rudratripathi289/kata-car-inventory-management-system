import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const TempDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.firstName}!</p>
      <button 
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

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
            <TempDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default AppRoutes;
