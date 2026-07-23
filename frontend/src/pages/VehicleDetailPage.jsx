import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleById, restockVehicle } from '../services/vehicleService';
import { FiArrowLeft, FiTag, FiCalendar, FiActivity, FiTruck, FiInfo, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRestocking, setIsRestocking] = useState(false);

  useEffect(() => {
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
      <div className="flex justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !vehicle) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{errorMsg || 'Vehicle not found'}</p>
        <button 
          onClick={() => navigate('/vehicles')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Return to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/vehicles')}
          className="mr-4 text-gray-500 hover:text-gray-700 flex items-center transition-colors"
        >
          <FiArrowLeft className="h-5 w-5 mr-1" /> Back to Inventory
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Header Section */}
        <div className="px-4 py-6 sm:px-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              VIN: <span className="font-mono uppercase">{vehicle.vin}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <span className="text-3xl font-extrabold text-blue-600">${vehicle.price.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-6 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
            {vehicle.imageUrl ? (
              <img 
                src={vehicle.imageUrl} 
                alt={`${vehicle.make} ${vehicle.model}`} 
                className="w-full h-auto rounded-lg shadow-sm object-cover max-h-96"
              />
            ) : (
              <div className="text-center text-gray-400 py-20">
                <FiTruck className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiTag className="mr-2" /> Condition
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    vehicle.condition === 'New' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vehicle.condition}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiActivity className="mr-2" /> Mileage
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {vehicle.mileage.toLocaleString()} miles
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiInfo className="mr-2" /> Engine
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {vehicle.engine}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiInfo className="mr-2" /> Transmission
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {vehicle.transmission}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiInfo className="mr-2" /> Fuel Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {vehicle.fuelType}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiInfo className="mr-2" /> Color
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {vehicle.color}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FiCheck className="mr-2" /> Stock Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {vehicle.quantity > 0 
                    ? <span className="text-green-600 font-medium">{vehicle.quantity} available</span>
                    : <span className="text-red-600 font-medium">Out of stock</span>
                  }
                </dd>
              </div>
            </dl>
            
            <div className="px-6 py-5 mt-2 flex flex-col sm:flex-row justify-end md:justify-start gap-4">
              <button
                onClick={() => navigate(`/vehicles/${vehicle._id}/purchase`)}
                disabled={vehicle.quantity <= 0}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              
              {user?.role === 'admin' && (
                <button
                  onClick={handleRestock}
                  disabled={isRestocking}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiRefreshCw className={`mr-2 h-5 w-5 ${isRestocking ? 'animate-spin' : ''}`} />
                  {isRestocking ? 'Restocking...' : 'Restock'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description & Features Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Vehicle Description</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-gray-700 whitespace-pre-wrap">
            {vehicle.description || 'No description provided for this vehicle.'}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default VehicleDetailPage;
