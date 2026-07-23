import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getVehicleById, createVehicle, updateVehicle } from '../services/vehicleService';
import { FiAlertCircle, FiSave, FiArrowLeft } from 'react-icons/fi';

const VehicleFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      condition: 'New',
      category: 'Sedan',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      features: []
    }
  });

  const [loading, setLoading] = useState(isEditMode);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await getVehicleById(id);
      
      // Parse features array to string for text area
      const vehicleData = {
        ...response.data,
        features: response.data.features ? response.data.features.join(', ') : ''
      };
      
      reset(vehicleData);
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
      // Process features string back to array
      const processedData = {
        ...data,
        year: parseInt(data.year, 10),
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity, 10),
        features: typeof data.features === 'string' 
          ? data.features.split(',').map(f => f.trim()).filter(f => f)
          : data.features
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
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/vehicles')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h1>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        {errorMsg && (
          <div className="mb-6 bg-red-50 p-4 rounded-md flex items-start">
            <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            <div className="sm:col-span-2">
              <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
              <input
                type="text"
                id="make"
                {...register('make', { required: 'Make is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.make && <p className="mt-1 text-sm text-red-600">{errors.make.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
              <input
                type="text"
                id="model"
                {...register('model', { required: 'Model is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                id="year"
                {...register('year', { 
                  required: 'Year is required',
                  min: { value: 1886, message: 'Invalid year' },
                  max: { value: new Date().getFullYear() + 1, message: 'Invalid year' }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                id="price"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                id="quantity"
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: { value: 0, message: 'Quantity cannot be negative' }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="vin" className="block text-sm font-medium text-gray-700">VIN</label>
              <input
                type="text"
                id="vin"
                {...register('vin', { required: 'VIN is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.vin && <p className="mt-1 text-sm text-red-600">{errors.vin.message}</p>}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
              <select
                id="condition"
                {...register('condition')}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                {...register('category')}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

            <div className="sm:col-span-6">
              <label htmlFor="features" className="block text-sm font-medium text-gray-700">
                Features (comma separated)
              </label>
              <textarea
                id="features"
                rows={3}
                {...register('features')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Bluetooth, Backup Camera, Leather Seats"
              />
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                {...register('imageUrl')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

          </div>

          <div className="pt-5 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
