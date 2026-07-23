const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const jwt = require('jsonwebtoken');

// Setup is handled by src/tests/setup.js

// Helper: create user and get token
const createUserAndGetToken = async (role = 'customer') => {
  const user = await User.create({
    firstName: 'Test',
    lastName: 'User',
    email: `${role}${Date.now()}@example.com`,
    password: 'password123',
    role,
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return { user, token };
};

// Helper: create a vehicle
const createVehicle = async (overrides = {}) => {
  return Vehicle.create({
    vin: `VIN${Date.now()}${Math.random().toString(36).substring(7)}`,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'Sedan',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'White',
    mileage: 0,
    condition: 'New',
    engine: '2.5L I4',
    price: 30000,
    quantity: 10,
    ...overrides,
  });
};

describe('POST /api/vehicles/:id/restock', () => {
  it('should return 401 if user is not authenticated', async () => {
    const vehicle = await createVehicle();

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .send({ quantity: 5 });

    expect(res.status).toBe(401);
  });

  it('should return 403 if user is not an admin', async () => {
    const { token } = await createUserAndGetToken('customer');
    const vehicle = await createVehicle();

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(403);
  });

  it('should restock a vehicle and increment quantity', async () => {
    const { token } = await createUserAndGetToken('admin');
    const vehicle = await createVehicle({ quantity: 3 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 10 });

    expect(res.status).toBe(200);
    expect(res.body.vehicle).toBeDefined();
    expect(res.body.vehicle.quantity).toBe(13);
  });

  it('should return 400 if restock quantity is zero or negative', async () => {
    const { token } = await createUserAndGetToken('admin');
    const vehicle = await createVehicle();

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 0 });

    expect(res.status).toBe(400);
  });

  it('should return 404 if vehicle does not exist', async () => {
    const { token } = await createUserAndGetToken('admin');
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/vehicles/${fakeId}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(404);
  });
});
