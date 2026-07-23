const Purchase = require('../models/Purchase');
const Vehicle = require('../models/Vehicle');
const { validationResult } = require('express-validator');

// @desc    Purchase a vehicle
// @route   POST /api/vehicles/:id/purchase
// @access  Private
const purchaseVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity } = req.body;
    const vehicleId = req.params.id;
    const buyerId = req.user._id;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Calculate total price
    const totalPrice = vehicle.price * quantity;

    // Decrease inventory
    vehicle.quantity -= quantity;
    await vehicle.save();

    // Save purchase history
    const purchase = await Purchase.create({
      vehicleId,
      buyerId,
      quantity,
      totalPrice,
    });

    res.status(201).json({ message: 'Purchase successful', purchase });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user purchases
// @route   GET /api/purchases/my-purchases
// @access  Private
const getMyPurchases = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    
    // Fetch directly from the purchases collection to avoid schema casting issues
    const rawPurchases = await mongoose.connection.db.collection('purchases')
      .find({
        $or: [
          { buyerId: req.user._id },
          { buyerId: req.user._id.toString() }
        ]
      })
      .sort({ purchasedAt: -1, createdAt: -1 })
      .toArray();

    // Populate vehicle details manually since we bypassed Mongoose
    const purchases = await Promise.all(rawPurchases.map(async (p) => {
      let vehicle = null;
      if (p.vehicleId) {
        try {
          vehicle = await Vehicle.findById(p.vehicleId).select('make model year price');
        } catch(e) {}
      }
      return {
        ...p,
        vehicleId: vehicle
      };
    }));
      
    res.json(purchases);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  purchaseVehicle,
  getMyPurchases,
};
