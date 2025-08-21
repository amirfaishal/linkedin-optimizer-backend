// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./auth');

dotenv.config();
const app = express();

// ✅ Middlewares
app.use(cors({ origin: 'http://localhost:5173' })); // 
app.use(express.json());


// ✅ Admin routes

// ✅ Other routes
app.use('/api/auth', authRoutes);

// ✅ Test endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
