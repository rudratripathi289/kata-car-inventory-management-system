const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const jwt = require('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_only';
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

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

describe('POST /api/vehicles/:id/purchase', () => {
  it('should return 401 if user is not authenticated', async () => {
    const vehicle = await createVehicle();

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .send({ quantity: 1 });

    expect(res.status).toBe(401);
  });

  it('should purchase a vehicle and decrement quantity', async () => {
    const { token } = await createUserAndGetToken('customer');
    const vehicle = await createVehicle({ quantity: 5 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.purchase).toBeDefined();
    expect(res.body.purchase.quantity).toBe(2);

    // Check vehicle quantity was decremented
    const updatedVehicle = await Vehicle.findById(vehicle._id);
    expect(updatedVehicle.quantity).toBe(3);
  });

  it('should return 400 if requested quantity exceeds available stock', async () => {
    const { token } = await createUserAndGetToken('customer');
    const vehicle = await createVehicle({ quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/insufficient/i);
  });

  it('should return 400 if quantity is zero or negative', async () => {
    const { token } = await createUserAndGetToken('customer');
    const vehicle = await createVehicle({ quantity: 5 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 0 });

    expect(res.status).toBe(400);
  });

  it('should return 404 if vehicle does not exist', async () => {
    const { token } = await createUserAndGetToken('customer');
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/vehicles/${fakeId}/purchase`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 1 });

    expect(res.status).toBe(404);
  });

  it('should return 400 if vehicle is out of stock (quantity = 0)', async () => {
    const { token } = await createUserAndGetToken('customer');
    const vehicle = await createVehicle({ quantity: 0 });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 1 });

    expect(res.status).toBe(400);
  });
});
