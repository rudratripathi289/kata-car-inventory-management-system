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
    const purchases = await Purchase.find({ buyerId: req.user._id })
      .populate('vehicleId', 'make model year price')
      .sort({ purchasedAt: -1 });
      
    res.json(purchases);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  purchaseVehicle,
  getMyPurchases,
};
