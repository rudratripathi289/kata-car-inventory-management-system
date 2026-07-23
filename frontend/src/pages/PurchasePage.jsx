import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleById, purchaseVehicle } from '../services/vehicleService';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle, FiCreditCard, FiLock, FiShield, FiTruck } from 'react-icons/fi';

const PurchasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
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

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      setErrorMsg('');
      await purchaseVehicle(id, quantity);
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
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <FiCreditCard className="absolute inset-0 m-auto h-8 w-8 text-blue-500 animate-pulse" />
        </div>
        <p className="mt-6 text-slate-500 font-semibold tracking-wide animate-pulse">Preparing checkout...</p>
      </div>
    );
  }

  if (errorMsg && !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <FiAlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Checkout Error</h2>
        <p className="text-red-500 text-lg mb-8">{errorMsg}</p>
        <button 
          onClick={() => navigate('/vehicles')}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          Return to Inventory
        </button>
      </div>
    );
  }

  if (purchaseSuccess) {
    return (
      <div className={`max-w-2xl mx-auto py-16 px-4 transition-all duration-700 ease-out ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 p-10 text-center relative overflow-hidden border border-slate-100">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
          
          <div className="relative z-10">
            <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner shadow-emerald-200/50 transform hover:scale-110 transition-transform duration-500">
              <FiCheckCircle className="h-12 w-12 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Purchase Successful!</h2>
            <p className="text-slate-500 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
              Congratulations on your new <span className="font-bold text-slate-800">{vehicle.year} {vehicle.make} {vehicle.model}</span>.
              We will contact you shortly with delivery details.
            </p>
            <button
              onClick={() => navigate('/vehicles')}
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-xl shadow-lg shadow-slate-900/20 text-white bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
            >
              Return to Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = vehicle.quantity <= 0;
  const totalPrice = vehicle.price * quantity;

  return (
    <div className={`max-w-4xl mx-auto space-y-8 pb-16 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
      <div className="flex items-center">
        <button 
          onClick={() => navigate(`/vehicles/${id}`)}
          className="group flex items-center px-4 py-2 text-sm font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
        >
          <FiArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> 
          Back to Vehicle
        </button>
      </div>

      <div className="bg-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="px-8 py-8 sm:px-10 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <FiLock className="h-6 w-6 text-slate-400 mr-3" />
            Checkout: {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-2 text-slate-500 flex items-center text-sm font-medium">
            <FiShield className="mr-1.5 text-emerald-500" /> Secure encrypted transaction
          </p>
        </div>
        
        <div className="p-8 sm:p-10 space-y-8">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start animate-shake">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0 h-5 w-5" />
              <p className="text-sm font-medium text-red-700">{errorMsg}</p>
            </div>
          )}

          {isOutOfStock && (
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-start">
              <FiAlertCircle className="text-amber-500 mt-0.5 mr-3 flex-shrink-0 h-5 w-5" />
              <p className="text-sm font-medium text-amber-800">
                This vehicle is currently out of stock and cannot be purchased at this time.
              </p>
            </div>
          )}

          {/* Order Summary Card */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-slate-50 p-8 rounded-2xl border border-slate-200 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-5 transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <FiTruck className="w-64 h-64" />
            </div>
            
            <div className="mb-6 md:mb-0 relative z-10">
              <h3 className="text-xl font-extrabold text-slate-800 mb-1">Order Summary</h3>
              <p className="text-sm font-medium text-slate-500 font-mono bg-slate-200/50 inline-block px-2 py-0.5 rounded">VIN: {vehicle.vin}</p>
              
              {!isOutOfStock && (
                <div className="mt-6 flex items-center bg-white border border-slate-200 p-2 rounded-xl shadow-sm inline-flex">
                  <label htmlFor="quantity" className="text-sm font-bold text-slate-600 px-3 border-r border-slate-100">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={vehicle.quantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0 && val <= vehicle.quantity) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 text-center text-lg font-black text-blue-600 focus:outline-none focus:ring-0 bg-transparent py-1"
                  />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-3 pr-2 border-l border-slate-100">
                    ({vehicle.quantity} max)
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-left md:text-right relative z-10 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-slate-200 md:border-none">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Price</p>
              <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-4">Payment Method</h3>
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex items-center hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-50 transition-colors">
                <FiCreditCard className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-slate-900">Credit Card ending in <span className="font-mono">4242</span></p>
                <p className="text-sm font-medium text-slate-500 mt-0.5">Expires 12/28</p>
              </div>
              <button type="button" className="px-4 py-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                Change
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 flex flex-col sm:flex-row justify-end items-center gap-4">
            <p className="text-xs text-slate-400 font-medium sm:mr-4 text-center sm:text-left">
              By confirming, you agree to our Terms of Service.
            </p>
            <button
              type="button"
              disabled={isPurchasing || isOutOfStock || quantity < 1 || quantity > vehicle.quantity}
              onClick={handlePurchase}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent shadow-lg shadow-emerald-500/20 text-base font-extrabold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {isPurchasing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Processing...
                </>
              ) : (
                'Confirm Purchase'
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
