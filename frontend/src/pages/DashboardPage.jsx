import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getVehicles, searchVehicles } from '../services/vehicleService';
import { FiBox, FiDollarSign, FiAlertCircle, FiClock } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth();
  
  const [metrics, setMetrics] = useState({
    totalVehicles: 0,
    totalValue: 0,
    lowStockCount: 0,
  });
  
  const [lowStockVehicles, setLowStockVehicles] = useState([]);
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all vehicles for metrics
        const allVehiclesResponse = await getVehicles();
        const allVehicles = allVehiclesResponse.data;
        
        let totalQuantity = 0;
        let totalValue = 0;
        let lowStockList = [];
        
        allVehicles.forEach(vehicle => {
          totalQuantity += vehicle.quantity;
          totalValue += (vehicle.price * vehicle.quantity);
          
          if (vehicle.quantity < 3) {
            lowStockList.push(vehicle);
          }
        });
        
        setMetrics({
          totalVehicles: totalQuantity,
          totalValue,
          lowStockCount: lowStockList.length,
        });
        
        setLowStockVehicles(lowStockList);
        
        // Fetch recent activity (newest 5 vehicles)
        const recentResponse = await searchVehicles({ 
          limit: 5, 
          sortBy: 'createdAt', 
          order: 'desc' 
        });
        setRecentVehicles(recentResponse.data.vehicles);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.firstName}! Here is what's happening with your inventory today.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Vehicles Card (Available for both) */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBox className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {isAdmin ? 'Total Vehicles in System' : 'Vehicles Available'}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {metrics.totalVehicles}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Only Cards */}
        {isAdmin && (
          <>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiDollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Inventory Value
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          ${metrics.totalValue.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className={`h-6 w-6 ${metrics.lowStockCount > 0 ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Low Stock Alerts (&lt; 3 items)
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {metrics.lowStockCount}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity (Newest Vehicles) */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <FiClock className="mr-2 text-gray-400" />
              Recently Added Vehicles
            </h3>
            <Link to="/vehicles" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentVehicles.length === 0 ? (
              <li className="px-4 py-8 text-center text-gray-500">No recent activity</li>
            ) : (
              recentVehicles.map(vehicle => (
                <li key={vehicle._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  <Link to={`/vehicles/${vehicle._id}`} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                      <p className="text-sm text-gray-500">Added to inventory</p>
                    </div>
                    <div className="text-sm text-gray-900 font-medium">
                      ${vehicle.price.toLocaleString()}
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Low Stock Vehicles Grid (Admin Only) */}
        {isAdmin && (
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
              <FiAlertCircle className="mr-2 text-red-500" />
              Low Stock Vehicles
            </h3>
            {lowStockVehicles.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                All vehicles have sufficient stock.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lowStockVehicles.slice(0, 4).map(vehicle => (
                  <div key={vehicle._id} className="bg-white shadow rounded-lg p-4 border border-red-100 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{vehicle.make} {vehicle.model}</h4>
                      <p className="text-xs text-gray-500 mb-2">VIN: {vehicle.vin}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {vehicle.quantity} left
                      </span>
                      <Link 
                        to={`/vehicles/${vehicle._id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Restock
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {lowStockVehicles.length > 4 && (
              <div className="mt-4 text-center">
                <Link to="/vehicles?stock=low" className="text-sm text-blue-600 hover:text-blue-800">
                  + {lowStockVehicles.length - 4} more low stock vehicles in inventory
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
