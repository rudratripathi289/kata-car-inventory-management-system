import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getVehicles, searchVehicles } from '../services/vehicleService';
import { FiBox, FiDollarSign, FiAlertCircle, FiClock, FiArrowRight, FiTrendingUp } from 'react-icons/fi';

let cachedDashboardData = null;

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchDashboardData = async () => {
      if (cachedDashboardData) {
        setMetrics(cachedDashboardData.metrics);
        setLowStockVehicles(cachedDashboardData.lowStockVehicles);
        setRecentVehicles(cachedDashboardData.recentVehicles);
        setLoading(false);
        return;
      }
      
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
        
        cachedDashboardData = {
          metrics: {
            totalVehicles: totalQuantity,
            totalValue,
            lowStockCount: lowStockList.length,
          },
          lowStockVehicles: lowStockList,
          recentVehicles: recentResponse.data.vehicles
        };
        
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
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className={`space-y-8 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Header section with gradient background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-10 shadow-xl shadow-blue-900/10 text-white">
        {/* Abstract background shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-[0.08] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-12 w-72 h-72 bg-white opacity-[0.06] rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-blue-100 max-w-xl text-lg opacity-90">
            {isAdmin 
              ? "Here is what's happening with your inventory today. You have full administrative access." 
              : "Here is what's happening with your inventory today. Browse available vehicles and manage your purchases."}
          </p>
        </div>
      </div>

      {/* Metrics Cards (Admin Only) */}
      {isAdmin && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-green-100 transition-all duration-300" style={{ transitionDelay: '100ms' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
            <div className="p-6 relative z-10">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-emerald-100/50 p-3 rounded-xl text-emerald-600">
                  <FiDollarSign className="h-6 w-6" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 truncate">
                    Total Inventory Value
                  </p>
                  <div className="flex items-baseline mt-1">
                    <p className="text-3xl font-bold text-slate-900">${metrics.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-red-100 transition-all duration-300" style={{ transitionDelay: '200ms' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
            <div className="p-6 relative z-10">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-xl ${metrics.lowStockCount > 0 ? 'bg-rose-100/50 text-rose-600' : 'bg-slate-100/50 text-slate-500'}`}>
                  <FiAlertCircle className="h-6 w-6" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 truncate">
                    Low Stock Alerts (&lt; 3 items)
                  </p>
                  <div className="flex items-baseline mt-1">
                    <p className="text-3xl font-bold text-slate-900">{metrics.lowStockCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Recent Activity (Newest Vehicles) - Full Width */}
        <div className="bg-white shadow-sm border border-slate-100 rounded-3xl overflow-hidden flex flex-col w-full">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-wrap gap-4">
            <div className="flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                <FiClock className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-800">
                Recently Added Vehicles
              </h3>
            </div>
            <div className="flex items-center gap-4">
              {/* Moved Total Vehicles Metric here */}
              <div className="flex items-center bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2">
                <FiBox className="w-5 h-5 text-blue-500 mr-2" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {isAdmin ? 'System Total' : 'Available'}
                  </span>
                  <span className="font-bold text-slate-900 leading-tight">
                    {metrics.totalVehicles} Vehicles
                  </span>
                </div>
              </div>
              <Link to="/vehicles" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center group bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                View all
                <FiArrowRight className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 p-2">
            <ul className="space-y-1">
              {recentVehicles.length === 0 ? (
                <li className="px-4 py-8 text-center text-slate-500">No recent activity</li>
              ) : (
                recentVehicles.map((vehicle, i) => (
                  <li 
                    key={vehicle._id} 
                    className="group"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <Link to={`/vehicles/${vehicle._id}`} className="block px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <FiTrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Added to inventory</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">${vehicle.price.toLocaleString()}</p>
                          <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${vehicle.condition === 'New' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            {vehicle.condition}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Low Stock Vehicles Grid (Admin Only) */}
        {isAdmin && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mr-3">
                  <FiAlertCircle className="w-4 h-4" />
                </span>
                Low Stock Vehicles
              </h3>
            </div>
            
            {lowStockVehicles.length === 0 ? (
              <div className="bg-white shadow-sm border border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center flex-1 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <FiBox className="w-8 h-8 text-emerald-500" />
                </div>
                <h4 className="text-slate-800 font-bold mb-1">Stock levels are healthy</h4>
                <p className="text-slate-500 text-sm max-w-xs">All vehicles have sufficient stock. Check back later for any alerts.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                {lowStockVehicles.slice(0, 4).map((vehicle, i) => (
                  <div 
                    key={vehicle._id} 
                    className="bg-white group shadow-sm border border-slate-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md hover:border-red-100 transition-all duration-300"
                    style={{ animationDelay: `${200 + i * 100}ms` }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 group-hover:bg-rose-100 transition-colors">
                          {vehicle.quantity} left
                        </span>
                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                          VIN: {vehicle.vin ? vehicle.vin.substring(vehicle.vin.length - 6) : 'N/A'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 line-clamp-1">{vehicle.make} {vehicle.model}</h4>
                      <p className="text-sm text-slate-500 mt-1">${vehicle.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="mt-5">
                      <Link 
                        to={`/vehicles/${vehicle._id}`}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-slate-200 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Restock
                      </Link>
                    </div>
                  </div>
                ))}
                
                {lowStockVehicles.length > 4 && (
                  <div className="sm:col-span-2 mt-2">
                    <Link 
                      to="/vehicles?stock=low" 
                      className="block w-full text-center px-4 py-3 rounded-xl bg-rose-50 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100/50"
                    >
                      View {lowStockVehicles.length - 4} more low stock vehicles in inventory
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
