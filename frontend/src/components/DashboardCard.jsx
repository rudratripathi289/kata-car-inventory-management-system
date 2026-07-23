import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className={`p-4 rounded-full ${colorClass} text-white mr-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
