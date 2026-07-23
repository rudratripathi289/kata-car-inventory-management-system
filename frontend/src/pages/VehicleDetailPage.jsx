import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleById, restockVehicle } from '../services/vehicleService';
import { FiArrowLeft, FiTag, FiCalendar, FiActivity, FiTruck, FiInfo, FiCheck, FiRefreshCw, FiDroplet, FiSettings, FiFileText } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRestocking, setIsRestocking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await getVehicleById(id);
      setVehicle(response.data);
    } catch (err) {
      setErrorMsg('Failed to load vehicle details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    const quantityStr = window.prompt('Enter quantity to restock:', '1');
    if (!quantityStr) return; // User cancelled
    
    const quantity = parseInt(quantityStr, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    try {
      setIsRestocking(true);
      await restockVehicle(id, quantity);
      // Refresh vehicle data
      await fetchVehicle();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to restock vehicle');
    } finally {
      setIsRestocking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <FiTruck className="absolute inset-0 m-auto h-8 w-8 text-blue-500 animate-pulse" />
        </div>
        <p className="mt-6 text-slate-500 font-semibold tracking-wide animate-pulse">Loading vehicle details...</p>
      </div>
    );
  }

  if (errorMsg || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <FiInfo className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-red-500 text-lg mb-8">{errorMsg || 'Vehicle not found'}</p>
        <button 
          onClick={() => navigate('/vehicles')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          Return to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto space-y-8 pb-16 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
      {/* Top Navigation */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/vehicles')}
          className="group flex items-center px-4 py-2 text-sm font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
        >
          <FiArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> 
          Back to Inventory
        </button>
      </div>

      <div className="bg-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="px-8 py-8 sm:px-10 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 inline-flex text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${
                vehicle.condition === 'New' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {vehicle.condition}
              </span>
              <span className="px-3 py-1 inline-flex text-xs font-bold uppercase tracking-wider rounded-full shadow-sm bg-blue-50 text-blue-700 border border-blue-100">
                {vehicle.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            </h1>
            <p className="mt-3 text-sm text-slate-500 font-medium flex items-center">
              <FiInfo className="mr-1.5 h-4 w-4" /> VIN: <span className="font-mono uppercase ml-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700">{vehicle.vin}</span>
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col items-start md:items-end">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Listed Price</p>
            <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              ${vehicle.price.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          
          {/* Image Section */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-slate-50/50 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 relative group">
            {vehicle.imageUrl ? (
              <div className="relative w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent z-10"></div>
                <img 
                  src={vehicle.imageUrl} 
                  alt={`${vehicle.make} ${vehicle.model}`} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            ) : (
              <div className="w-full aspect-video md:aspect-[4/3] rounded-2xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <FiTruck className="h-16 w-16 mb-4 opacity-30" />
                <p className="font-medium">No image available</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 flex flex-col h-full">
            <div className="p-8 sm:p-10 flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
                  <FiSettings className="w-4 h-4" />
                </div>
                Key Specifications
              </h3>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                    <FiActivity className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mileage</dt>
                    <dd className="mt-1 text-base font-bold text-slate-800">{vehicle.mileage.toLocaleString()} miles</dd>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                    <FiInfo className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engine</dt>
                    <dd className="mt-1 text-base font-bold text-slate-800">{vehicle.engine}</dd>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                    <FiSettings className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transmission</dt>
                    <dd className="mt-1 text-base font-bold text-slate-800">{vehicle.transmission}</dd>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                    <FiDroplet className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fuel Type</dt>
                    <dd className="mt-1 text-base font-bold text-slate-800">{vehicle.fuelType}</dd>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                    <FiTag className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color</dt>
                    <dd className="mt-1 text-base font-bold text-slate-800">{vehicle.color}</dd>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                    <FiCheck className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Status</dt>
                    <dd className="mt-1">
                      {vehicle.quantity > 0 
                        ? <span className="inline-flex items-center text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md"><FiCheck className="mr-1.5 h-4 w-4"/> {vehicle.quantity} available</span>
                        : <span className="inline-flex items-center text-red-600 font-bold bg-red-50 px-2.5 py-0.5 rounded-md"><FiInfo className="mr-1.5 h-4 w-4"/> Out of stock</span>
                      }
                    </dd>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Action Buttons Footer */}
            <div className="px-8 py-6 sm:px-10 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row justify-end gap-4 mt-auto">
              
              {user?.role === 'admin' && (
                <button
                  onClick={handleRestock}
                  disabled={isRestocking}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-slate-300 shadow-sm text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50"
                >
                  <FiRefreshCw className={`mr-2 h-5 w-5 ${isRestocking ? 'animate-spin' : ''}`} />
                  {isRestocking ? 'Restocking...' : 'Restock'}
                </button>
              )}

              <button
                onClick={() => navigate(`/vehicles/${vehicle._id}/purchase`)}
                disabled={vehicle.quantity <= 0}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent shadow-md shadow-emerald-500/20 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Buy Now
              </button>
              
            </div>
          </div>
        </div>
      </div>

      {/* Description & Features Section */}
      <div className="bg-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden border border-slate-100">
        <div className="px-8 py-6 sm:px-10 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
              <FiFileText className="w-4 h-4" />
            </div>
            Vehicle Description
          </h3>
        </div>
        <div className="px-8 py-8 sm:px-10">
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base">
            {vehicle.description ? (
              vehicle.description.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
              ))
            ) : (
              <p className="italic text-slate-400">No description provided for this vehicle.</p>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default VehicleDetailPage;
