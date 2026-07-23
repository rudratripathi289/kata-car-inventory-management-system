const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { body } = require('express-validator');

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
  // TODO: Add auth & admin middleware in Step 10
  .post(vehicleValidation, createVehicle);

router.route('/:id')
  .get(getVehicleById)
  // TODO: Add auth & admin middleware in Step 10
  .put(vehicleValidation, updateVehicle)
  // TODO: Add auth & admin middleware in Step 10
  .delete(deleteVehicle);

module.exports = router;
