import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import { FiTruck, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth();

  // Hardcoded for now. Will be populated from API later.
  const stats = [
    { title: 'Total Vehicles', value: '124', icon: FiTruck, colorClass: 'bg-blue-500' },
    { title: 'Total Value', value: '$3.2M', icon: FiDollarSign, colorClass: 'bg-green-500' },
    { title: 'Low Stock', value: '5', icon: FiAlertTriangle, colorClass: 'bg-red-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-gray-600 mt-1">Here's what's happening with your inventory today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            colorClass={stat.colorClass}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-sm">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
