# Test Results

All tests have successfully passed for the Car Dealership Inventory System backend. 

```text
> kata-car-inventory-management-system@1.0.0 test
> jest --forceExit --detectOpenHandles

PASS src/tests/vehicle.test.js
PASS src/tests/auth.test.js
PASS src/tests/purchase.test.js
PASS src/tests/restock.test.js
PASS src/tests/middleware.test.js

Test Suites: 5 passed, 5 total
Tests:       44 passed, 44 total
Snapshots:   0 total
Time:        6.951 s
Ran all test suites.
```

## Summary of Tests Performed
1. **Authentication Tests** (`auth.test.js`):
   - User registration (success & error cases)
   - User login (success & error cases)
2. **Vehicle CRUD & Search Tests** (`vehicle.test.js`):
   - Creating, reading, updating, deleting vehicles
   - Pagination, search by make, category, price, and sorting.
3. **Purchase Tests** (`purchase.test.js`):
   - Purchasing functionality with validation (stock checking)
   - Quantity decrementing after a successful purchase.
4. **Restock Tests** (`restock.test.js`):
   - Restocking functionality for admins only.
   - Quantity incrementing after successful restock.
5. **Middleware Tests** (`middleware.test.js`):
   - Testing JWT verification token extraction (`protect`)
   - Testing role-based access (`admin`)
