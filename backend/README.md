# Car Dealership Inventory System Backend

This is a RESTful API backend for a Car Dealership Inventory System built using Node.js, Express.js, MongoDB, and Mongoose. It follows the MVC architecture and incorporates Test-Driven Development (TDD).

## Features
- **User Authentication**: JWT-based authentication with bcrypt password hashing.
- **Role-Based Access Control**: `admin` and `customer` roles.
- **Vehicle Management**: Full CRUD operations for vehicles (Admin only).
- **Vehicle Search**: Search vehicles with pagination, sorting, and filters (make, model, category, price range).
- **Purchasing**: Customers can purchase vehicles, which updates the inventory accordingly.
- **Restocking**: Admins can restock vehicle inventory.
- **Centralized Error Handling**: Unified error response format.
- **Validation**: express-validator for robust request validation.

## Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

## Installation

1. Clone the repository and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the `backend` root directory based on the provided `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car_dealership
JWT_SECRET=your_super_secret_jwt_key
```

## Running the Server

- **Development Mode** (with nodemon):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

## Running Tests

The project uses Jest and Supertest with `mongodb-memory-server` for isolated testing.

```bash
npm test
```
To run tests in watch mode during development:
```bash
npm run test:watch
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get token

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get a single vehicle by ID
- `GET /api/vehicles/search` - Search vehicles (Supports query params: `make`, `model`, `category`, `minPrice`, `maxPrice`, `condition`, `fuelType`, `transmission`, `page`, `limit`, `sortBy`, `order`)
- `POST /api/vehicles` - Add a new vehicle (Admin only)
- `PUT /api/vehicles/:id` - Update a vehicle (Admin only)
- `DELETE /api/vehicles/:id` - Delete a vehicle (Admin only)

### Purchasing & Restocking
- `POST /api/vehicles/:id/purchase` - Purchase a vehicle (Private)
  - Body: `{ "quantity": 1 }`
- `POST /api/vehicles/:id/restock` - Restock vehicle inventory (Admin only)
  - Body: `{ "quantity": 5 }`
