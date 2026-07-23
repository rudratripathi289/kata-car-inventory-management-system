const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vin: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    fuelType: {
      type: String,
      required: true,
      trim: true,
    },
    transmission: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Used'],
    },
    engine: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster searching
vehicleSchema.index({ make: 1 });
vehicleSchema.index({ model: 1 });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ price: 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
