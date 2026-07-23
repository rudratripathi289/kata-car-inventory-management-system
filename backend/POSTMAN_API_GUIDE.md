# Postman API Testing Guide & Request Bodies

This document contains a step-by-step guide, environment setup, and all JSON request bodies needed to test every API endpoint in the **Car Inventory Management System** using Postman.

---

## 🚀 Quick Setup Instructions

1. **Server Base URL**: `http://localhost:5000`
2. **Global Headers**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer <YOUR_JWT_TOKEN>` (Required for protected endpoints)

---

## 📌 Postman Environment Variables (Recommended)

In Postman, create an Environment (e.g., `Car-Inventory-Local`) with the following variables:

| Variable Name | Initial / Current Value | Description |
| :--- | :--- | :--- |
| `base_url` | `http://localhost:5000` | Base URL of the running Express server |
| `admin_token` | *(Leave empty, set after Admin login)* | JWT Token for Admin user |
| `customer_token` | *(Leave empty, set after Customer login)* | JWT Token for Customer user |
| `vehicle_id` | *(Leave empty, set after creating vehicle)* | MongoDB `_id` of a vehicle |

---

## 📑 Complete API Endpoints Overview

| # | Method | Endpoint | Access | Description |
| :- | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/api/health` | Public | System Health Check |
| 2 | `POST` | `/api/auth/register` | Public | Register Customer or Admin |
| 3 | `POST` | `/api/auth/login` | Public | Login & Retrieve JWT Token |
| 4 | `GET` | `/api/vehicles` | Public | List all vehicles |
| 5 | `GET` | `/api/vehicles/search` | Public | Search & filter vehicles |
| 6 | `GET` | `/api/vehicles/:id` | Public | Get single vehicle details |
| 7 | `POST` | `/api/vehicles` | Admin | Create a new vehicle |
| 8 | `PUT` | `/api/vehicles/:id` | Admin | Update existing vehicle |
| 9 | `DELETE` | `/api/vehicles/:id` | Admin | Delete a vehicle |
| 10| `POST` | `/api/vehicles/:id/purchase` | Customer/Auth | Purchase vehicle(s) |
| 11| `POST` | `/api/vehicles/:id/restock` | Admin | Restock vehicle inventory |

---

## 📝 Request Details & JSON Request Bodies

### 1. Health Check
- **Method**: `GET`
- **URL**: `{{base_url}}/api/health`
- **Headers**: None
- **Body**: None
- **Expected Response (`200 OK`)**:
  ```json
  {
    "status": "API is running"
  }
  ```

---

### 2. Authentication APIs

#### 2.1 Register User (Customer)
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **JSON Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "customer@example.com",
    "password": "password123",
    "role": "customer",
    "phone": "+1234567890"
  }
  ```
- **Expected Response (`201 Created`)**:
  ```json
  {
    "_id": "64f8a123bc456def78901234",
    "firstName": "John",
    "lastName": "Doe",
    "email": "customer@example.com",
    "role": "customer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 2.2 Register User (Admin)
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **JSON Body**:
  ```json
  {
    "firstName": "System",
    "lastName": "Admin",
    "email": "admin@example.com",
    "password": "adminpassword123",
    "role": "admin",
    "phone": "+1987654321"
  }
  ```

#### 2.3 Login User
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **JSON Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpassword123"
  }
  ```
- **Expected Response (`200 OK`)**:
  ```json
  {
    "_id": "64f8a123bc456def78901235",
    "firstName": "System",
    "lastName": "Admin",
    "email": "admin@example.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

> 💡 **Tip**: Copy the returned `token` string and set it in your Postman variable `admin_token` or `customer_token`.

---

### 3. Vehicle Inventory APIs

#### 3.1 Create Vehicle (Admin Only)
- **Method**: `POST`
- **URL**: `{{base_url}}/api/vehicles`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{admin_token}}`
- **JSON Body**:
  ```json
  {
    "vin": "1HGCR2F83HA000001",
    "make": "Honda",
    "model": "Accord",
    "year": 2023,
    "category": "Sedan",
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "color": "Crystal Black Pearl",
    "mileage": 12000,
    "condition": "Used",
    "engine": "2.0L Turbo I4",
    "price": 28500,
    "quantity": 5,
    "imageUrl": "https://images.unsplash.com/photo-1590362891991-f776e747a588",
    "description": "Clean title, single owner, excellent condition."
  }
  ```
- **Expected Response (`201 Created`)**:
  ```json
  {
    "_id": "65ab1234cde5678901234567",
    "vin": "1HGCR2F83HA000001",
    "make": "Honda",
    "model": "Accord",
    "year": 2023,
    "category": "Sedan",
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "color": "Crystal Black Pearl",
    "mileage": 12000,
    "condition": "Used",
    "engine": "2.0L Turbo I4",
    "price": 28500,
    "quantity": 5,
    "imageUrl": "https://images.unsplash.com/photo-1590362891991-f776e747a588",
    "description": "Clean title, single owner, excellent condition.",
    "createdAt": "2026-07-23T13:00:00.000Z",
    "updatedAt": "2026-07-23T13:00:00.000Z"
  }
  ```

#### 3.2 Get All Vehicles
- **Method**: `GET`
- **URL**: `{{base_url}}/api/vehicles`
- **Headers**: None
- **Body**: None

#### 3.3 Search & Filter Vehicles
- **Method**: `GET`
- **URL**: `{{base_url}}/api/vehicles/search`
- **Query Parameters**:
  - `make` = `Honda` *(optional, case-insensitive partial match)*
  - `model` = `Accord` *(optional)*
  - `category` = `Sedan` *(optional)*
  - `minPrice` = `10000` *(optional)*
  - `maxPrice` = `35000` *(optional)*
  - `condition` = `Used` *(optional, `New` or `Used`)*
  - `fuelType` = `Gasoline` *(optional)*
  - `transmission` = `Automatic` *(optional)*
  - `sortBy` = `price` *(optional, default: `createdAt`)*
  - `order` = `asc` *(optional, `asc` or `desc`, default: `desc`)*
  - `page` = `1` *(optional, default: `1`)*
  - `limit` = `10` *(optional, default: `10`)*
- **Example URL**:
  `http://localhost:5000/api/vehicles/search?make=Honda&category=Sedan&minPrice=20000&maxPrice=30000&sortBy=price&order=asc&page=1&limit=10`
- **Expected Response (`200 OK`)**:
  ```json
  {
    "vehicles": [ ... ],
    "page": 1,
    "pages": 1,
    "total": 1
  }
  ```

#### 3.4 Get Vehicle By ID
- **Method**: `GET`
- **URL**: `{{base_url}}/api/vehicles/{{vehicle_id}}`
- **Headers**: None
- **Body**: None

#### 3.5 Update Vehicle (Admin Only)
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/vehicles/{{vehicle_id}}`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{admin_token}}`
- **JSON Body**:
  ```json
  {
    "vin": "1HGCR2F83HA000001",
    "make": "Honda",
    "model": "Accord EX-L",
    "year": 2023,
    "category": "Sedan",
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "color": "Crystal Black Pearl",
    "mileage": 12500,
    "condition": "Used",
    "engine": "2.0L Turbo I4",
    "price": 27990,
    "quantity": 5,
    "imageUrl": "https://images.unsplash.com/photo-1590362891991-f776e747a588",
    "description": "Price updated for special weekend clearance sale."
  }
  ```

#### 3.6 Purchase Vehicle (Customer / Auth User)
- **Method**: `POST`
- **URL**: `{{base_url}}/api/vehicles/{{vehicle_id}}/purchase`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{customer_token}}`
- **JSON Body**:
  ```json
  {
    "quantity": 1
  }
  ```
- **Expected Response (`201 Created`)**:
  ```json
  {
    "message": "Purchase successful",
    "purchase": {
      "_id": "65ab9999cde5678901239999",
      "vehicleId": "65ab1234cde5678901234567",
      "buyerId": "64f8a123bc456def78901234",
      "quantity": 1,
      "totalPrice": 27990,
      "createdAt": "2026-07-23T13:05:00.000Z"
    }
  }
  ```

#### 3.7 Restock Vehicle (Admin Only)
- **Method**: `POST`
- **URL**: `{{base_url}}/api/vehicles/{{vehicle_id}}/restock`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{admin_token}}`
- **JSON Body**:
  ```json
  {
    "quantity": 10
  }
  ```
- **Expected Response (`200 OK`)**:
  ```json
  {
    "message": "Restock successful",
    "vehicle": {
      "_id": "65ab1234cde5678901234567",
      "quantity": 14
    }
  }
  ```

#### 3.8 Delete Vehicle (Admin Only)
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/vehicles/{{vehicle_id}}`
- **Headers**:
  - `Authorization`: `Bearer {{admin_token}}`
- **Body**: None
- **Expected Response (`200 OK`)**:
  ```json
  {
    "message": "Vehicle removed"
  }
  ```

---

## 🧪 Recommended Test Order Flow

1. Call **`GET /api/health`** to verify backend server status.
2. Call **`POST /api/auth/register`** to create an Admin account (`role: "admin"`).
3. Call **`POST /api/auth/register`** to create a Customer account (`role: "customer"`).
4. Call **`POST /api/auth/login`** for Admin and store the returned `token`.
5. Call **`POST /api/vehicles`** with Admin token to add a new car. Copy the returned `_id`.
6. Call **`GET /api/vehicles`** to view the full inventory.
7. Call **`GET /api/vehicles/search?make=Honda`** to test search and filtering.
8. Call **`GET /api/vehicles/:id`** to view single vehicle details.
9. Call **`POST /api/vehicles/:id/purchase`** with Customer token to test stock decrement and purchase history.
10. Call **`POST /api/vehicles/:id/restock`** with Admin token to test restocking stock addition.
11. Call **`PUT /api/vehicles/:id`** with Admin token to update vehicle details.
12. Call **`DELETE /api/vehicles/:id`** with Admin token to remove the vehicle.
