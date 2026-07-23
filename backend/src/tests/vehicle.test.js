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

const sampleVehicleData = {
  vin: 'WBA3A5C55CF256789',
  make: 'BMW',
  model: '3 Series',
  year: 2023,
  category: 'Sedan',
  fuelType: 'Gasoline',
  transmission: 'Automatic',
  color: 'Black',
  mileage: 15000,
  condition: 'New',
  engine: '2.0L Turbo I4',
  price: 45000,
  quantity: 5,
};

describe('GET /api/vehicles', () => {
  it('should return all vehicles', async () => {
    await Vehicle.create({
      ...sampleVehicleData,
      vin: 'VIN001',
    });
    await Vehicle.create({
      ...sampleVehicleData,
      vin: 'VIN002',
    });

    const res = await request(app).get('/api/vehicles');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should return empty array if no vehicles exist', async () => {
    const res = await request(app).get('/api/vehicles');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe('GET /api/vehicles/:id', () => {
  it('should return a single vehicle by id', async () => {
    const vehicle = await Vehicle.create(sampleVehicleData);

    const res = await request(app).get(`/api/vehicles/${vehicle._id}`);

    expect(res.status).toBe(200);
    expect(res.body.make).toBe('BMW');
  });

  it('should return 404 for non-existent vehicle', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/vehicles/${fakeId}`);

    expect(res.status).toBe(404);
  });
});

describe('POST /api/vehicles', () => {
  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send(sampleVehicleData);

    expect(res.status).toBe(401);
  });

  it('should return 403 if user is not admin', async () => {
    const { token } = await createUserAndGetToken('customer');

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleVehicleData);

    expect(res.status).toBe(403);
  });

  it('should create a vehicle if user is admin', async () => {
    const { token } = await createUserAndGetToken('admin');

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleVehicleData);

    expect(res.status).toBe(201);
    expect(res.body.make).toBe('BMW');
    expect(res.body.vin).toBe('WBA3A5C55CF256789');
  });

  it('should return 400 for duplicate VIN', async () => {
    const { token } = await createUserAndGetToken('admin');
    await Vehicle.create(sampleVehicleData);

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleVehicleData);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/VIN/i);
  });

  it('should return 400 if required fields are missing', async () => {
    const { token } = await createUserAndGetToken('admin');

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'BMW' });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/vehicles/:id', () => {
  it('should update a vehicle if user is admin', async () => {
    const { token } = await createUserAndGetToken('admin');
    const vehicle = await Vehicle.create(sampleVehicleData);

    const res = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...sampleVehicleData, color: 'Red', price: 50000 });

    expect(res.status).toBe(200);
    expect(res.body.color).toBe('Red');
    expect(res.body.price).toBe(50000);
  });

  it('should return 404 for non-existent vehicle', async () => {
    const { token } = await createUserAndGetToken('admin');
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/vehicles/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(sampleVehicleData);

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/vehicles/:id', () => {
  it('should delete a vehicle if user is admin', async () => {
    const { token } = await createUserAndGetToken('admin');
    const vehicle = await Vehicle.create(sampleVehicleData);

    const res = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/removed/i);

    const deleted = await Vehicle.findById(vehicle._id);
    expect(deleted).toBeNull();
  });

  it('should return 403 if user is not admin', async () => {
    const { token } = await createUserAndGetToken('customer');
    const vehicle = await Vehicle.create(sampleVehicleData);

    const res = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe('GET /api/vehicles/search', () => {
  beforeEach(async () => {
    await Vehicle.create([
      { ...sampleVehicleData, vin: 'VIN001', make: 'BMW', price: 45000, category: 'Sedan' },
      { ...sampleVehicleData, vin: 'VIN002', make: 'Toyota', model: 'Camry', price: 30000, category: 'Sedan' },
      { ...sampleVehicleData, vin: 'VIN003', make: 'Ford', model: 'F-150', price: 55000, category: 'Truck' },
      { ...sampleVehicleData, vin: 'VIN004', make: 'BMW', model: 'X5', price: 65000, category: 'SUV' },
    ]);
  });

  it('should return paginated results', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?page=1&limit=2');

    expect(res.status).toBe(200);
    expect(res.body.vehicles).toHaveLength(2);
    expect(res.body.total).toBe(4);
    expect(res.body.pages).toBe(2);
  });

  it('should filter by make', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=BMW');

    expect(res.status).toBe(200);
    expect(res.body.vehicles).toHaveLength(2);
    res.body.vehicles.forEach((v) => {
      expect(v.make).toBe('BMW');
    });
  });

  it('should filter by price range', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=40000&maxPrice=60000');

    expect(res.status).toBe(200);
    res.body.vehicles.forEach((v) => {
      expect(v.price).toBeGreaterThanOrEqual(40000);
      expect(v.price).toBeLessThanOrEqual(60000);
    });
  });

  it('should filter by category', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=Truck');

    expect(res.status).toBe(200);
    expect(res.body.vehicles).toHaveLength(1);
    expect(res.body.vehicles[0].model).toBe('F-150');
  });

  it('should sort by price ascending', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?sortBy=price&order=asc');

    expect(res.status).toBe(200);
    const prices = res.body.vehicles.map((v) => v.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });
});
