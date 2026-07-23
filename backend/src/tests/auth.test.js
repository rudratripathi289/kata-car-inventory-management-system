const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

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

describe('POST /api/auth/register', () => {
  it('should register a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('john@example.com');
    expect(res.body.firstName).toBe('John');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should return 400 if email already exists', async () => {
    await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'duplicate@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'missing@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 400 if password is less than 6 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Short',
        lastName: 'Pass',
        email: 'short@example.com',
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should default role to customer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Default',
        lastName: 'Role',
        email: 'default@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe('customer');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await User.create({
      firstName: 'Login',
      lastName: 'User',
      email: 'login@example.com',
      password: 'password123',
    });
  });

  it('should login with valid credentials and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('login@example.com');
  });

  it('should return 401 with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should return 401 with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'noone@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(401);
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'password123' });

    expect(res.status).toBe(400);
  });
});
