import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiShield, FiDollarSign, FiTruck, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { getMyPurchases } from '../services/purchaseService';

const ProfilePage = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) {
      setMounted(true);
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyPurchases();
      console.log('Purchase data received:', data);
      setPurchases(data || []);
    } catch (err) {
      console.error('Failed to load purchases:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load purchases');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const roleDisplay = user.role === 'admin' ? 'Admin' : 'Customer';
  const safePurchases = Array.isArray(purchases) ? purchases : [];
  const totalExpense = safePurchases.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
  const totalOwnedCars = safePurchases.reduce((sum, p) => sum + (p.quantity || 0), 0);

  return (
    <div className={`max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account details and view your garage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Profile Info */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden border border-slate-100 relative group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
            
            <div className="px-6 py-8 relative z-10 text-center border-b border-slate-100 bg-white/50 backdrop-blur-sm">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4 transform group-hover:scale-105 transition-transform duration-300">
                <FiUser className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{`${user.firstName} ${user.lastName}`}</h3>
              <p className="text-slate-500 text-sm mt-1">{user.email}</p>
              <div className="mt-4">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold uppercase tracking-wider rounded-full shadow-sm ${
                  user.role === 'admin' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {roleDisplay}
                </span>
              </div>
            </div>
            
            <div className="px-6 py-6 bg-slate-50/50">
              <dl className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiUser className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="ml-3">
                    <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full name</dt>
                    <dd className="text-sm font-medium text-slate-900 mt-1">{`${user.firstName} ${user.lastName}`}</dd>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiMail className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="ml-3">
                    <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email address</dt>
                    <dd className="text-sm font-medium text-slate-900 mt-1">{user.email}</dd>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiPhone className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="ml-3">
                    <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone number</dt>
                    <dd className="text-sm font-medium text-slate-900 mt-1">{user.phone || 'Not provided'}</dd>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiShield className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="ml-3">
                    <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Role</dt>
                    <dd className="text-sm font-medium text-slate-900 mt-1">{roleDisplay}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-blue-50/50 backdrop-blur-md border border-blue-100 p-5 rounded-3xl shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiShield className="h-4 w-4 text-blue-600" aria-hidden="true" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                  Profile updates are currently disabled. Please contact an administrator to change your personal details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Garage & History */}
        <div className="lg:col-span-2 space-y-6">
          
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            My Garage & Purchase History
          </h2>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white overflow-hidden shadow-xl shadow-slate-200/40 rounded-3xl border border-slate-100 group relative transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="p-6 relative z-10">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-emerald-100/50 p-4 rounded-2xl text-emerald-600">
                    <FiDollarSign className="h-7 w-7" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider truncate">Total Expense</dt>
                    <dd className="text-3xl font-extrabold text-slate-900 mt-1">
                      ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-xl shadow-slate-200/40 rounded-3xl border border-slate-100 group relative transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="p-6 relative z-10">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100/50 p-4 rounded-2xl text-indigo-600">
                    <FiTruck className="h-7 w-7" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider truncate">Owned Cars</dt>
                    <dd className="text-3xl font-extrabold text-slate-900 mt-1">{totalOwnedCars}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase History Table */}
          <div className="bg-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden border border-slate-100 flex flex-col h-[400px]">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  <FiCalendar className="h-4 w-4" />
                </div>
                Transaction History
              </h3>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                  </div>
                  <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading purchase history...</p>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <FiAlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-slate-800 font-bold mb-1">Error loading purchases</p>
                  <p className="text-slate-500 text-sm max-w-sm">{error}</p>
                </div>
              ) : purchases.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <FiTruck className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-slate-800 font-bold text-lg mb-1">Your garage is empty</p>
                  <p className="text-slate-500 text-sm">You haven't purchased any vehicles yet.</p>
                </div>
              ) : (
                <div className="h-full overflow-y-auto custom-scrollbar">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Qty</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Price</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                      {purchases.map((purchase, i) => (
                        <tr 
                          key={purchase._id} 
                          className="hover:bg-slate-50 transition-colors"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">
                            {purchase.purchasedAt ? new Date(purchase.purchasedAt).toLocaleDateString() : (purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : '-')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                            {purchase.vehicleId ? `${purchase.vehicleId.year} ${purchase.vehicleId.make} ${purchase.vehicleId.model}` : 'Unknown Vehicle'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-600">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{purchase.quantity}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                            {purchase.vehicleId ? `$${purchase.vehicleId.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-slate-900">
                            ${purchase.totalPrice ? purchase.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
