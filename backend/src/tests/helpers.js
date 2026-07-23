const jwt = require('jsonwebtoken');

// Helper to generate a valid JWT for testing
const generateTestToken = (userId, secret = 'test_jwt_secret_key_for_testing_only') => {
  return jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
};

// Sample vehicle data for tests
const sampleVehicle = {
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
  description: 'Brand new BMW 3 Series sedan.',
};

// Sample user data for tests
const sampleUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'customer',
};

const sampleAdmin = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'adminpass123',
  role: 'admin',
};

module.exports = {
  generateTestToken,
  sampleVehicle,
  sampleUser,
  sampleAdmin,
};
