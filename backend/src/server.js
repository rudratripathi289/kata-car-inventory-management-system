require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
// connectDB(); // Will uncomment in Step 2

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
