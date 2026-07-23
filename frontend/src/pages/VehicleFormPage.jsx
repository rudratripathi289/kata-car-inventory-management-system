import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getVehicleById, createVehicle, updateVehicle } from '../services/vehicleService';
import { FiAlertCircle, FiSave, FiArrowLeft, FiTruck, FiInfo, FiTag, FiSettings, FiImage } from 'react-icons/fi';

const VehicleFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      condition: 'New',
      category: 'Sedan',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
    }
  });

  const [loading, setLoading] = useState(isEditMode);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isEditMode) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await getVehicleById(id);
      reset(response.data);
    } catch (err) {
      setErrorMsg('Failed to load vehicle details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const processedData = {
        ...data,
        year: parseInt(data.year, 10),
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity, 10),
        mileage: parseInt(data.mileage, 10),
      };

      if (isEditMode) {
        await updateVehicle(id, processedData);
      } else {
        await createVehicle(processedData);
      }
      
      navigate('/vehicles');
    } catch (error) {
      console.error('Error saving vehicle:', error);
      setErrorMsg(error.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading vehicle data...</p>
      </div>
    );
  }

  // Helper component for section headers
  const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center mb-6">
      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
  );

  return (
    <div className={`max-w-5xl mx-auto space-y-8 pb-16 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/vehicles')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 shadow-sm"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h1>
            <p className="text-slate-500 mt-1">
              {isEditMode ? `Updating vehicle record #${id}` : 'Fill in the details to add a new vehicle to your inventory.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden border border-slate-100">
        
        {errorMsg && (
          <div className="m-6 bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start animate-shake">
            <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0 h-5 w-5" />
            <p className="text-sm font-medium text-red-700">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 sm:p-10 space-y-12">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-6">
            <SectionHeader title="Basic Information" icon={FiInfo} />
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
              <div className="sm:col-span-2 group">
                <label htmlFor="vin" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">VIN *</label>
                <input
                  type="text"
                  id="vin"
                  {...register('vin', { required: 'VIN is required' })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all uppercase shadow-sm"
                />
                {errors.vin && <p className="mt-2 text-sm font-medium text-red-500">{errors.vin.message}</p>}
              </div>

              <div className="sm:col-span-2 group">
                <label htmlFor="make" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Make *</label>
                <input
                  type="text"
                  id="make"
                  {...register('make', { required: 'Make is required' })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
                {errors.make && <p className="mt-2 text-sm font-medium text-red-500">{errors.make.message}</p>}
              </div>

              <div className="sm:col-span-2 group">
                <label htmlFor="model" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Model *</label>
                <input
                  type="text"
                  id="model"
                  {...register('model', { required: 'Model is required' })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
                {errors.model && <p className="mt-2 text-sm font-medium text-red-500">{errors.model.message}</p>}
              </div>
              
              <div className="sm:col-span-2 group">
                <label htmlFor="year" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Year *</label>
                <input
                  type="number"
                  id="year"
                  {...register('year', { 
                    required: 'Year is required',
                    min: { value: 1886, message: 'Invalid year' },
                    max: { value: new Date().getFullYear() + 1, message: 'Invalid year' }
                  })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
                {errors.year && <p className="mt-2 text-sm font-medium text-red-500">{errors.year.message}</p>}
              </div>

              <div className="sm:col-span-2 group">
                <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Category *</label>
                <select
                  id="category"
                  {...register('category', { required: 'Category is required' })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Van">Van</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Wagon">Wagon</option>
                </select>
              </div>

              <div className="sm:col-span-2 group">
                <label htmlFor="condition" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Condition *</label>
                <select
                  id="condition"
                  {...register('condition', { required: 'Condition is required' })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Section 2: Specifications */}
          <div className="space-y-6">
            <SectionHeader title="Specifications" icon={FiSettings} />
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
              <div className="sm:col-span-2 group">
                <label htmlFor="fuelType" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Fuel Type *</label>
                <select
                  id="fuelType"
                  {...register('fuelType', { required: 'Fuel type is required' })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="sm:col-span-2 group">
                <label htmlFor="transmission" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Transmission *</label>
                <select
                  id="transmission"
                  {...register('transmission', { required: 'Transmission is required' })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              <div className="sm:col-span-2 group">
                <label htmlFor="engine" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Engine *</label>
                <input
                  type="text"
                  id="engine"
                  {...register('engine', { required: 'Engine is required' })}
                  placeholder="e.g. 2.0L 4-Cylinder"
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
                {errors.engine && <p className="mt-2 text-sm font-medium text-red-500">{errors.engine.message}</p>}
              </div>

              <div className="sm:col-span-3 group">
                <label htmlFor="color" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Color *</label>
                <input
                  type="text"
                  id="color"
                  {...register('color', { required: 'Color is required' })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
                {errors.color && <p className="mt-2 text-sm font-medium text-red-500">{errors.color.message}</p>}
              </div>

              <div className="sm:col-span-3 group">
                <label htmlFor="mileage" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Mileage *</label>
                <input
                  type="number"
                  id="mileage"
                  {...register('mileage', { 
                    required: 'Mileage is required',
                    min: { value: 0, message: 'Mileage cannot be negative' }
                  })}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
                {errors.mileage && <p className="mt-2 text-sm font-medium text-red-500">{errors.mileage.message}</p>}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Section 3: Pricing & Inventory */}
          <div className="space-y-6">
            <SectionHeader title="Pricing & Inventory" icon={FiTag} />
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
              <div className="sm:col-span-3 group relative">
                <label htmlFor="price" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-emerald-600">Price ($) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    className="block w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-white transition-all shadow-sm font-semibold"
                  />
                </div>
                {errors.price && <p className="mt-2 text-sm font-medium text-red-500">{errors.price.message}</p>}
              </div>

              <div className="sm:col-span-3 group">
                <label htmlFor="quantity" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Quantity in Stock *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiTruck className="text-slate-400" />
                  </div>
                  <input
                    type="number"
                    id="quantity"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 0, message: 'Quantity cannot be negative' }
                    })}
                    className="block w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm font-semibold"
                  />
                </div>
                {errors.quantity && <p className="mt-2 text-sm font-medium text-red-500">{errors.quantity.message}</p>}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Section 4: Media & Details */}
          <div className="space-y-6">
            <SectionHeader title="Media & Details" icon={FiImage} />
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
              <div className="sm:col-span-6 group">
                <label htmlFor="imageUrl" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  {...register('imageUrl')}
                  placeholder="https://example.com/car.jpg"
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="sm:col-span-6 group">
                <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  placeholder="Enter any additional details about the vehicle..."
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all shadow-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50 -mx-10 -mb-10 p-6 rounded-b-3xl">
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="px-6 py-3 border border-slate-300 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center px-8 py-3 border border-transparent shadow-md shadow-blue-500/20 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <FiSave className="-ml-1 mr-2 h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleFormPage;
