const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
} = require('../controllers/vehicleController');
const { purchaseVehicle } = require('../controllers/purchaseController');
const { body } = require('express-validator');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Validation middleware for creating/updating a vehicle
const vehicleValidation = [
  body('vin', 'VIN is required').not().isEmpty(),
  body('make', 'Make is required').not().isEmpty(),
  body('model', 'Model is required').not().isEmpty(),
  body('year', 'Valid year is required').isInt({ min: 1886 }),
  body('category', 'Category is required').not().isEmpty(),
  body('fuelType', 'Fuel type is required').not().isEmpty(),
  body('transmission', 'Transmission is required').not().isEmpty(),
  body('color', 'Color is required').not().isEmpty(),
  body('mileage', 'Mileage must be a positive number').isFloat({ min: 0 }),
  body('condition', 'Condition must be New or Used').isIn(['New', 'Used']),
  body('engine', 'Engine is required').not().isEmpty(),
  body('price', 'Price must be a positive number').isFloat({ min: 0 }),
  body('quantity', 'Quantity must be a positive integer').isInt({ min: 0 }),
];

router.route('/')
  .get(getVehicles)
  .post(protect, admin, vehicleValidation, createVehicle);

// Search route (must be before /:id)
router.get('/search', searchVehicles);

router.route('/:id')
  .get(getVehicleById)
  .put(protect, admin, vehicleValidation, updateVehicle)
  .delete(protect, admin, deleteVehicle);

// Purchase route
router.post(
  '/:id/purchase',
  protect,
  [body('quantity', 'Quantity is required and must be at least 1').isInt({ min: 1 })],
  purchaseVehicle
);

module.exports = router;
