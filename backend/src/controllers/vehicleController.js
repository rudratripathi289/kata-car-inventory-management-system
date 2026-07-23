const Vehicle = require('../models/Vehicle');
const { validationResult } = require('express-validator');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
const createVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = new Vehicle(req.body);
    const createdVehicle = await vehicle.save();
    res.status(201).json(createdVehicle);
  } catch (error) {
    // Handle duplicate VIN error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Vehicle with this VIN already exists' });
    }
    next(error);
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
const updateVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      await vehicle.deleteOne();
      res.json({ message: 'Vehicle removed' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Search vehicles with filters, pagination, and sorting
// @route   GET /api/vehicles/search
// @access  Public
const searchVehicles = async (req, res, next) => {
  try {
    const {
      make,
      model,
      category,
      minPrice,
      maxPrice,
      condition,
      fuelType,
      transmission,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    if (make) filter.make = { $regex: make, $options: 'i' };
    if (model) filter.model = { $regex: model, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (condition) filter.condition = condition;
    if (fuelType) filter.fuelType = { $regex: fuelType, $options: 'i' };
    if (transmission) filter.transmission = { $regex: transmission, $options: 'i' };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const vehicles = await Vehicle.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Vehicle.countDocuments(filter);

    res.json({
      vehicles,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restock a vehicle
// @route   POST /api/vehicles/:id/restock
// @access  Private/Admin
const restockVehicle = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const vehicleId = req.params.id;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle.quantity += quantity;
    await vehicle.save();

    res.status(200).json({ message: 'Restock successful', vehicle });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  restockVehicle,
};
