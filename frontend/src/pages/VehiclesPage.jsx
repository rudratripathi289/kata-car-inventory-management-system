import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchVehicles, getVehicles } from '../services/vehicleService';
import { FiPlus, FiSearch, FiFilter, FiBox, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi';

const VehiclesPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isLowStock = searchParams.get('stock') === 'low';

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Pagination and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;
  
  useEffect(() => {
    setMounted(true);
    fetchVehicles(currentPage);
  }, [currentPage, isLowStock]); 

  const fetchVehicles = async (page = 1) => {
    try {
      setLoading(true);
      
      if (isLowStock) {
        // Client-side filtering for low stock since backend doesn't support it directly
        const response = await getVehicles();
        let allVehicles = response.data;
        
        // Filter by make (if searching) and low stock
        if (searchTerm) {
          allVehicles = allVehicles.filter(v => v.make.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        allVehicles = allVehicles.filter(v => v.quantity < 3);
        
        const total = allVehicles.length;
        const pages = Math.ceil(total / limit);
        
        // Manual pagination
        const startIndex = (page - 1) * limit;
        const paginatedVehicles = allVehicles.slice(startIndex, startIndex + limit);
        
        setVehicles(paginatedVehicles);
        setTotalPages(pages || 1);
        setTotalItems(total);
      } else {
        // Normal server-side search/pagination
        const response = await searchVehicles({ make: searchTerm, page, limit }); 
        setVehicles(response.data.vehicles);
        setTotalPages(response.data.pages);
        setTotalItems(response.data.total);
      }
      
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchVehicles(1);
  };

  return (
    <div className={`space-y-6 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 mt-1">
            {isLowStock ? 'Viewing vehicles with low stock levels' : 'Browse, search, and manage your entire fleet'}
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <Link
            to="/vehicles/new"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Vehicle
          </Link>
        )}
      </div>

      <div className="bg-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden border border-slate-100">
        
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                <FiSearch className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 shadow-sm"
                placeholder="Search by make (e.g. Toyota)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 rounded-2xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all duration-200"
            >
              <FiFilter className="-ml-1 mr-2 h-4 w-4" />
              Search
            </button>
          </form>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px] relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 opacity-20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading vehicles...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-slate-800 font-bold mb-1">Error Loading Data</p>
              <p className="text-slate-500 text-sm">{error}</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FiBox className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-800 font-bold text-lg mb-1">No vehicles found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50">
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Make</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Model</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Year</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Condition</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                    <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {vehicles.map((vehicle, index) => (
                    <tr 
                      key={vehicle._id} 
                      className="hover:bg-blue-50/30 transition-colors group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-800">{vehicle.make}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-600">{vehicle.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-500 font-medium">{vehicle.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">${vehicle.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-[10px] font-extrabold uppercase tracking-wider rounded-full ${
                          vehicle.condition === 'New' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {vehicle.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${vehicle.quantity < 3 ? 'text-rose-600' : 'text-slate-600'}`}>
                          {vehicle.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/vehicles/${vehicle._id}`} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                            View
                          </Link>
                          {user?.role === 'admin' && (
                            <Link to={`/vehicles/${vehicle._id}/edit`} className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                              Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && vehicles.length > 0 && (
          <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Showing <span className="font-bold text-slate-700">{(currentPage - 1) * limit + 1}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * limit, totalItems)}</span> of <span className="font-bold text-slate-700">{totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm overflow-hidden" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 bg-white border-y border-l border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-blue-600 disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 bg-white border-y border-slate-200 text-sm font-bold text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 bg-white border-y border-r border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-blue-600 disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <FiChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;
