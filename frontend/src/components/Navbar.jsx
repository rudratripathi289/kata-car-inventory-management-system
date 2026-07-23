import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800">Car Dealership Admin</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-gray-700">
          <FiUser className="mr-2" />
          <span className="font-medium">{user?.firstName} {user?.lastName}</span>
        </div>
        <button 
          onClick={logout}
          className="flex items-center text-red-600 hover:text-red-800 transition-colors"
        >
          <FiLogOut className="mr-1" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
