import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleById, purchaseVehicle } from '../services/vehicleService';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle, FiCreditCard } from 'react-icons/fi';

const PurchasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

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

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      setErrorMsg('');
      await purchaseVehicle(id, 1); // Purchasing 1 vehicle for now
      setPurchaseSuccess(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to complete purchase');
      console.error(err);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (errorMsg && !vehicle) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{errorMsg}</p>
        <button 
          onClick={() => navigate('/vehicles')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Return to Inventory
        </button>
      </div>
    );
  }

  if (purchaseSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FiCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Purchase Successful!</h2>
          <p className="text-gray-600 mb-8">
            Congratulations on your new {vehicle.year} {vehicle.make} {vehicle.model}.
            We will contact you shortly with delivery details.
          </p>
          <button
            onClick={() => navigate('/vehicles')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Inventory
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center">
        <button 
          onClick={() => navigate(`/vehicles/${id}`)}
          className="mr-4 text-gray-500 hover:text-gray-700 flex items-center transition-colors"
        >
          <FiArrowLeft className="h-5 w-5 mr-1" /> Back to Vehicle
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Checkout: {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
        </div>
        
        <div className="px-4 py-5 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 p-4 rounded-md flex items-start">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          {isOutOfStock && (
            <div className="bg-yellow-50 p-4 rounded-md flex items-start">
              <FiAlertCircle className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                This vehicle is currently out of stock and cannot be purchased at this time.
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:justify-between items-center bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
              <p className="text-sm text-gray-500 mt-1">VIN: {vehicle.vin}</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-3xl font-bold text-blue-600">${vehicle.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
            <div className="bg-white border border-gray-300 rounded-md p-4 flex items-center">
              <FiCreditCard className="h-6 w-6 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Credit Card ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/28</p>
              </div>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Change
              </button>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="button"
              disabled={isPurchasing || isOutOfStock}
              onClick={handlePurchase}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPurchasing ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
